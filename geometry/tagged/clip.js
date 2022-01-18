import { rewrite, visit } from './visit.js';

import { cached } from './cached.js';
import { clip as clipGraphs } from '../graph/clip.js';
import { hash } from './hash.js';
import { isNotTypeVoid } from './type.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

const collectTargets = (geometry, graphOut, segmentsOut) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        graphOut.push(geometry);
        break;
      case 'segments':
        segmentsOut.push(geometry);
        break;
    }
    descend();
  };
  visit(geometry, op);
};

const collectClips = (geometry, out) => {
  const op = (geometry, descend) => {
    if (geometry.type === 'graph' && isNotTypeVoid(geometry)) {
      out.push(geometry);
    }
    descend();
  };
  visit(geometry, op);
};

export const clip = cached(
  (geometry, geometries) => {
    if (geometries.some((value) => value === undefined)) {
      throw Error('undef');
    }
    return ['clip', hash(geometry), ...geometries.map(hash)];
  },
  (geometry, geometries) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  // Collect graphs for rewriting.
  const rewriteGraphs = [];
  const rewriteSegments = [];
  collectTargets(concreteGeometry, rewriteGraphs, rewriteSegments);
  // The other graphs are just read from.
  const readGraphs = [];
  for (const geometry of geometries) {
    collectClips(toConcreteGeometry(geometry), readGraphs);
  }
  const { clippedGraphGeometries, clippedSegmentsGeometries } = clipGraphs(
    rewriteGraphs,
    rewriteSegments,
    readGraphs
  );
  const map = new Map();
  for (let nth = 0; nth < clippedGraphGeometries.length; nth++) {
    map.set(rewriteGraphs[nth], clippedGraphGeometries[nth]);
  }
  for (let nth = 0; nth < clippedSegmentsGeometries.length; nth++) {
    map.set(rewriteSegments[nth], clippedSegmentsGeometries[nth]);
  }
  const update = (geometry, descend) => {
    const clipped = map.get(geometry);
    if (clipped) {
      return clipped;
    } else {
      return descend();
    }
  };
  return rewrite(concreteGeometry, update);
});

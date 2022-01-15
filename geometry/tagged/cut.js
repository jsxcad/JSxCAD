import { rewrite, visit } from './visit.js';

import { cached } from './cached.js';
import { cut as cutGraphs } from '../graph/cut.js';
import { hash } from './hash.js';
import { isNotTypeMasked } from './type.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

// Masked geometry is cut.
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

// Masked geometry doesn't cut.
const collectRemoves = (geometry, out) => {
  const op = (geometry, descend) => {
    if (
      geometry.type === 'graph' &&
      isNotTypeMasked(geometry) &&
      !geometry.graph.isEmpty
    ) {
      out.push(geometry);
    }
    descend();
  };
  visit(geometry, op);
};

export const cut = cached(
  (geometry, geometries) => ['cut', hash(geometry), ...geometries.map(hash)],
  (geometry, geometries) => {
    const concreteGeometry = toConcreteGeometry(geometry);
    const rewriteGraphs = [];
    const rewriteSegments = [];
    collectTargets(concreteGeometry, rewriteGraphs, rewriteSegments);
    const readGraphs = [];
    for (const geometry of geometries) {
      collectRemoves(toConcreteGeometry(geometry), readGraphs);
    }
    const { cutGraphGeometries, cutSegmentsGeometries } = cutGraphs(
      rewriteGraphs,
      rewriteSegments,
      readGraphs
    );
    const map = new Map();
    for (let nth = 0; nth < cutGraphGeometries.length; nth++) {
      map.set(rewriteGraphs[nth], cutGraphGeometries[nth]);
    }
    for (let nth = 0; nth < cutSegmentsGeometries.length; nth++) {
      map.set(rewriteSegments[nth], cutSegmentsGeometries[nth]);
    }

    const update = (geometry, descend) => {
      const cut = map.get(geometry);
      if (cut) {
        return cut;
      } else {
        return descend();
      }
    };
    return rewrite(concreteGeometry, update);
  }
);

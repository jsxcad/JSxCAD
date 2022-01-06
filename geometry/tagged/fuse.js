import { fuse as fuseGraphs } from '../graph/fuse.js';
import { isNotTypeVoid } from './type.js';
import { taggedGroup } from './taggedGroup.js';
import { taggedSegments } from './taggedSegments.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

const collect = (geometry, graphs, segments) => {
  const op = (geometry, descend) => {
    if (isNotTypeVoid(geometry)) {
      if (geometry.type === 'graph') {
        graphs.push(geometry);
      } else if (geometry.type === 'segments') {
        segments.push(geometry);
      }
    }
    descend();
  };
  visit(geometry, op);
};

export const fuse = (geometries) => {
  const graphs = [];
  const segments = [];
  for (const geometry of geometries) {
    collect(toConcreteGeometry(geometry), graphs, segments);
  }
  const fusedGraphs = fuseGraphs(graphs);
  const fusedSegments = segments.flatMap(({ segments }) => segments);
  if (fusedSegments.length > 0) {
    return taggedGroup({}, ...fusedGraphs, taggedSegments({}, fusedSegments));
  } else {
    return taggedGroup({}, ...fusedGraphs);
  }
};

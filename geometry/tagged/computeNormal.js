import { fill } from './fill.js';
import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { computeNormal as graph } from '../graph/computeNormal.js';
import { op } from './op.js';
import { taggedGroup } from './taggedGroup.js';
import { visit } from './visit.js';

const paths = (geometry) => computeNormal(fill(geometry));
const polygonsWithHoles = (geometry) =>
  graph(fromPolygonsWithHolesToGraph(geometry));
const segments = (geometry) => ({ type: 'points', points: [[0, 0, 1]] });

export const computeNormal = (geometry) => {
  let last;
  // Keep the last normal, since we don't know how to weight normals in composition.
  const accumulate = (normal) => {
    last = normal;
    return normal;
  };
  op({ graph, polygonsWithHoles, paths, segments }, visit, accumulate);
  if (last) {
    return last;
  }
  return taggedGroup({});
};

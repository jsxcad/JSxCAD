import { doesSelfIntersectOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const test = (graph) => {
  if (doesSelfIntersectOfSurfaceMesh(toSurfaceMesh(graph))) {
    throw Error('Self-intersection detected');
  }
  return graph;
};

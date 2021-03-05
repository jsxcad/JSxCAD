import { fromSurfaceMeshToTriangles } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const toTriangles = (graph) => {
  return fromSurfaceMeshToTriangles(toSurfaceMesh(graph));
};

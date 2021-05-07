import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { growSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const grow = (graph, amount) => {
  return fromSurfaceMeshLazy(growSurfaceMesh(toSurfaceMesh(graph), amount));
};

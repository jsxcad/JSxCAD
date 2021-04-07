import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { remeshSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const remesh = (graph, options = {}) =>
  fromSurfaceMeshLazy(remeshSurfaceMesh(toSurfaceMesh(graph), options));

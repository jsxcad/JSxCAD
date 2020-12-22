import {
  remeshSurfaceMesh,
  subdivideSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (graph, options = {}) => {
  const { method = 'Remesh' } = options;
  switch (method) {
    case 'Remesh':
      return fromSurfaceMeshLazy(
        remeshSurfaceMesh(toSurfaceMesh(graph), options)
      );
    default:
      return fromSurfaceMeshLazy(
        subdivideSurfaceMesh(toSurfaceMesh(graph), options)
      );
  }
};

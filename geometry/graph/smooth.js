import {
  remeshSurfaceMesh,
  subdivideSurfaceMesh,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const smooth = (geometry, options = {}) => {
  const { method = 'Remesh' } = options;
  switch (method) {
    case 'Remesh':
      return taggedGraph(
        { tags: geometry.tags },
        fromSurfaceMeshLazy(
          remeshSurfaceMesh(toSurfaceMesh(geometry.graph), options)
        )
      );
    default:
      return taggedGraph(
        { tags: geometry.tags },
        fromSurfaceMeshLazy(
          subdivideSurfaceMesh(toSurfaceMesh(geometry.graph), options)
        )
      );
  }
};

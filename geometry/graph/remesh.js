import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { remeshSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const remesh = (geometry, options = {}) =>
  taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(
      remeshSurfaceMesh(toSurfaceMesh(geometry.graph), options)
    )
  );

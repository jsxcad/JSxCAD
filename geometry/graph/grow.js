import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { growSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const grow = (geometry, amount) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMeshLazy(growSurfaceMesh(toSurfaceMesh(geometry.graph), amount))
  );

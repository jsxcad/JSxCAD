import { fromSurfaceMesh, growSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const grow = (geometry, amount) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(growSurfaceMesh(toSurfaceMesh(geometry.graph), amount))
  );

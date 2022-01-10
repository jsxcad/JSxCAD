import { bendSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const bend = (geometry, radius) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMeshLazy(
      bendSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix, radius)
    )
  );

import { demeshSurfaceMesh, fromSurfaceMesh } from '@jsxcad/algorithm-cgal';

import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const demesh = (geometry, options) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      demeshSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix, options)
    )
  );

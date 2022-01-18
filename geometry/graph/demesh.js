import { demeshSurfaceMesh } from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const demesh = (geometry) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMeshLazy(demeshSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix))
  );

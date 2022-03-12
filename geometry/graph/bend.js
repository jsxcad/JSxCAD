import { bendSurfaceMesh, fromSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const bend = (geometry, radius) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      bendSurfaceMesh(toSurfaceMesh(geometry.graph), geometry.matrix, radius)
    )
  );

import {
  fromSurfaceMesh,
  removeSelfIntersectionsOfSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const removeSelfIntersections = (geometry) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      removeSelfIntersectionsOfSurfaceMesh(toSurfaceMesh(geometry.graph))
    )
  );

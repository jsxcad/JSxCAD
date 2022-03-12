import { fromSurfaceMesh, pushSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const push = (geometry, force, minimumDistance, maximumDistance) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      pushSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        force,
        minimumDistance,
        maximumDistance
      )
    )
  );

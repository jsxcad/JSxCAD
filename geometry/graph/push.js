import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { pushSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const push = (graph, force, minimumDistance, maximumDistance) =>
  fromSurfaceMeshLazy(
    pushSurfaceMesh(
      toSurfaceMesh(graph),
      force,
      minimumDistance,
      maximumDistance
    )
  );

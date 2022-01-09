import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { twistSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const twist = (geometry, turnsPerMm) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMeshLazy(
      twistSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        turnsPerMm
      )
    )
  );

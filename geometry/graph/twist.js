import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { twistSurfaceMesh } from '@jsxcad/algorithm-cgal';

export const twist = (geometry, degreesPerMm) =>
  taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(
      twistSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        degreesPerMm
      )
    )
  );

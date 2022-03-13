import { fromSurfaceMesh, twistSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const twist = (geometry, turnsPerMm) =>
  taggedGraph(
    { tags: geometry.tags, matrix: geometry.matrix },
    fromSurfaceMesh(
      twistSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        turnsPerMm
      )
    )
  );

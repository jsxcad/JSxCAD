import {
  fromSurfaceMesh,
  loftBetweenSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const loft2 = (a, b) =>
  taggedGraph(
    { tags: a.tags },
    fromSurfaceMesh(
      loftBetweenSurfaceMeshes(
        toSurfaceMesh(a.graph),
        a.matrix,
        toSurfaceMesh(b.graph),
        b.matrix
      )
    )
  );

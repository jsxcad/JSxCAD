import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { loftBetweenCongruentSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const loft = (a, b) =>
  taggedGraph(
    { tags: a.tags },
    fromSurfaceMeshLazy(
      loftBetweenCongruentSurfaceMeshes(
        toSurfaceMesh(a.graph),
        a.matrix,
        toSurfaceMesh(b.graph),
        b.matrix
      )
    )
  );

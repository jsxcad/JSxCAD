import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { loftBetweenSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const loft2 = (a, b) =>
  taggedGraph(
    { tags: a.tags },
    fromSurfaceMeshLazy(
      loftBetweenSurfaceMeshes(
        toSurfaceMesh(a.graph),
        a.matrix,
        toSurfaceMesh(b.graph),
        b.matrix
      )
    )
  );

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { minkowskiDifferenceOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const minkowskiDifference = (a, b) => {
  if (a.graph.isEmpty || b.graph.isEmpty) {
    return a;
  }
  return taggedGraph(
    {},
    fromSurfaceMeshLazy(
      minkowskiDifferenceOfSurfaceMeshes(
        toSurfaceMesh(a.graph),
        a.matrix,
        toSurfaceMesh(b.graph),
        b.matrix
      )
    )
  );
};

import { differenceOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { doesNotOverlap } from './doesNotOverlap.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { info } from '@jsxcad/sys';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const difference = (a, b) => {
  if (a.graph.isEmpty || b.graph.isEmpty) {
    return a;
  }
  if (doesNotOverlap(a, b)) {
    return a;
  }
  const result = fromSurfaceMeshLazy(
    differenceOfSurfaceMeshes(
      toSurfaceMesh(a.graph),
      a.matrix,
      toSurfaceMesh(b.graph),
      b.matrix
    )
  );
  return taggedGraph({ tags: a.tags }, result);
};

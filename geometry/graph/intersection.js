import { doesNotOverlap } from './doesNotOverlap.js';
import { fromEmpty } from './fromEmpty.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { intersectionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const intersection = (a, b) => {
  if (a.graph.isEmpty || b.graph.isEmpty) {
    return fromEmpty();
  }
  if (doesNotOverlap(a, b)) {
    return fromEmpty();
  }
  const result = fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(
      toSurfaceMesh(a.graph),
      a.matrix,
      toSurfaceMesh(b.graph),
      b.matrix
    )
  );
  return taggedGraph({ tags: a.tags }, result);
};

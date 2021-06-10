import { doesNotOverlap } from './doesNotOverlap.js';
import { fromEmpty } from './fromEmpty.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { info } from '@jsxcad/sys';
import { intersectionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const intersection = (a, b) => {
  if (a.graph.isEmpty || b.graph.isEmpty) {
    return fromEmpty();
  }
  if (a.graph.isClosed && b.graph.isClosed && doesNotOverlap(a, b)) {
    return fromEmpty();
  }
  info('intersection begin');
  const result = fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(
      toSurfaceMesh(a.graph),
      a.matrix,
      toSurfaceMesh(b.graph),
      b.matrix
    )
  );
  info('intersection end');
  return taggedGraph({ tags: a.tags }, result);
};

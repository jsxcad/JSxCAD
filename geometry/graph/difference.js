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
  if (a.graph.isClosed && b.graph.isClosed && doesNotOverlap(a, b)) {
    return a;
  }
  info('difference begin');
  const result = fromSurfaceMeshLazy(
    differenceOfSurfaceMeshes(toSurfaceMesh(a.graph), toSurfaceMesh(b.graph))
  );
  info('difference end');
  return taggedGraph({ tags: a.tags }, result);
};

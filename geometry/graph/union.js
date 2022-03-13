import {
  fromSurfaceMesh,
  toSurfaceMesh,
  unionOfSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

import { taggedGraph } from '../tagged/taggedGraph.js';

export const union = (a, b) => {
  if (a.graph.isEmpty) {
    return b;
  }
  if (b.graph.isEmpty) {
    return a;
  }
  // FIX: In an ideal world, if a and b do not overlap, we would generate a disjointAssembly of the two.
  const result = fromSurfaceMesh(
    unionOfSurfaceMeshes(
      toSurfaceMesh(a.graph),
      a.matrix,
      toSurfaceMesh(b.graph),
      b.matrix
    )
  );
  return taggedGraph({ tags: a.tags }, result);
};

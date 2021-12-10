import { cutClosedSurfaceMeshIncrementally } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const cutVolumeIncrementally = (a, check, cuts) => {
  if (a.graph.isEmpty) {
    return a;
  }
  const result = fromSurfaceMeshLazy(
    cutClosedSurfaceMeshIncrementally(
      toSurfaceMesh(a.graph),
      a.matrix,
      check,
      cuts.map(({ graph, matrix }) => ({ mesh: toSurfaceMesh(graph), matrix }))
    )
  );
  return taggedGraph({ tags: a.tags, matrix: a.matrix }, result);
};

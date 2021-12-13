import { deletePendingSurfaceMeshes, toSurfaceMesh } from './toSurfaceMesh.js';

import { cutClosedSurfaceMeshSingly } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const cutVolumeSingly = (a, check, cuts) => {
  if (a.graph.isEmpty) {
    return a;
  }
  const result = fromSurfaceMeshLazy(
    cutClosedSurfaceMeshSingly(
      toSurfaceMesh(a.graph),
      a.matrix,
      check,
      cuts.map(({ graph, matrix }) => ({ mesh: toSurfaceMesh(graph), matrix }))
    )
  );
  deletePendingSurfaceMeshes();
  return taggedGraph({ tags: a.tags, matrix: a.matrix }, result);
};

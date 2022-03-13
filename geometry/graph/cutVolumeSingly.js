import {
  cutClosedSurfaceMeshSingly,
  deletePendingSurfaceMeshes,
  fromSurfaceMesh,
  toSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const cutVolumeSingly = (a, check, cuts) => {
  if (a.graph.isEmpty) {
    return a;
  }
  const result = fromSurfaceMesh(
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

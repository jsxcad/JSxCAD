import {
  cutClosedSurfaceMeshSinglyRecursive,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const cutVolumeSinglyRecursive = (a, check, cuts) => {
  if (a.graph.isEmpty) {
    return a;
  }
  const result = fromSurfaceMesh(
    cutClosedSurfaceMeshSinglyRecursive(
      toSurfaceMesh(a.graph),
      a.matrix,
      check,
      cuts.map(({ graph, matrix }) => ({ mesh: toSurfaceMesh(graph), matrix }))
    )
  );
  return taggedGraph({ tags: a.tags, matrix: a.matrix }, result);
};

import {
  fromSurfaceMesh,
  minkowskiSumOfSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const minkowskiSum = ({ tags }, a, b) => {
  if (a.graph.isEmpty || b.graph.isEmpty) {
    return a;
  }
  return taggedGraph(
    { tags },
    fromSurfaceMesh(
      minkowskiSumOfSurfaceMeshes(
        toSurfaceMesh(a.graph),
        a.matrix,
        toSurfaceMesh(b.graph),
        b.matrix
      )
    )
  );
};

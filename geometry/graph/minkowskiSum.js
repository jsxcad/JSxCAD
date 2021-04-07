import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { minkowskiSumOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const minkowskiSum = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  return fromSurfaceMeshLazy(
    minkowskiSumOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

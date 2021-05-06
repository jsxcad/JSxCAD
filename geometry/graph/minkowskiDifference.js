import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { minkowskiDifferenceOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const minkowskiDifference = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  return fromSurfaceMeshLazy(
    minkowskiDifferenceOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

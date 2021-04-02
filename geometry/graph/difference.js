import { differenceOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const difference = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  return fromSurfaceMeshLazy(
    differenceOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { minkowskiShellOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const minkowskiShell = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  return fromSurfaceMeshLazy(
    minkowskiShellOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

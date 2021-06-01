import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { info } from '@jsxcad/sys';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { unionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';

export const union = (a, b) => {
  if (a.isEmpty) {
    return b;
  }
  if (b.isEmpty) {
    return a;
  }
  // FIX: In an ideal world, if a and b do not overlap, we would generate a disjointAssembly of the two.
  info('union begin');
  const result = fromSurfaceMeshLazy(
    unionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
  info('union end');
  return result;
};

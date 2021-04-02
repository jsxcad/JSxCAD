import { fromEmpty } from './fromEmpty.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { intersectionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const intersection = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return fromEmpty();
  }
  return fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

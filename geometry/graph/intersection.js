import { doesNotOverlap } from './doesNotOverlap.js';
import { fromEmpty } from './fromEmpty.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { info } from '@jsxcad/sys';
import { intersectionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const intersection = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return fromEmpty();
  }
  if (a.isClosed && b.isClosed && doesNotOverlap(a, b)) {
    return fromEmpty();
  }
  info('intersection begin');
  const result = fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
  info('intersection end');
  return result;
};

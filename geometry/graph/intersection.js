import { doesNotOverlap } from './doesNotOverlap.js';
import { extrude } from './extrude.js';
import { fromEmpty } from './fromEmpty.js';
import { fromPaths } from './fromPaths.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { intersectionOfSurfaceMeshes } from '@jsxcad/algorithm-cgal';
import { principlePlane } from './principlePlane.js';
import { section } from './section.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const far = 10000;

export const intersection = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return fromEmpty();
  }
  if (!a.isClosed) {
    return fromPaths(
      section(intersection(extrude(a, far, 0), b), [principlePlane(a)])[0]
    );
  }
  if (!b.isClosed) {
    b = extrude(b, far, 0);
  }
  if (doesNotOverlap(a, b)) {
    return fromEmpty();
  }
  return fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

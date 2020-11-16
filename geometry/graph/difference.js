import {
  //   differenceOfNefPolyhedrons,
  differenceOfSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { doesNotOverlap } from './doesNotOverlap.js';
import { extrude } from './extrude.js';
// import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { principlePlane } from './principlePlane.js';
import { section } from './section.js';
// import { toNefPolyhedron } from './toNefPolyhedron.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const far = 10000;

export const difference = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  if (!a.isClosed) {
    return section(principlePlane(a), difference(extrude(a, far, 0), b));
  }
  if (!b.isClosed) {
    b = extrude(b, far, 0);
  }
  if (doesNotOverlap(a, b)) {
    return a;
  }
  // return fromNefPolyhedron(differenceOfNefPolyhedrons(toNefPolyhedron(a), toNefPolyhedron(b)));
  return fromSurfaceMeshLazy(
    differenceOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

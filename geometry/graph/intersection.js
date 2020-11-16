import { doesNotOverlap } from './doesNotOverlap.js';
import { extrude } from './extrude.js';
// import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import {
  //  intersectionOfNefPolyhedrons,
  intersectionOfSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { principlePlane } from './principlePlane.js';
import { section } from './section.js';
// import { toNefPolyhedron } from './toNefPolyhedron.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

const far = 10000;

export const intersection = (a, b) => {
  if (a.isEmpty) {
    return a;
  }
  if (b.isEmpty) {
    return b;
  }
  if (!a.isClosed) {
    return section(principlePlane(a), intersection(extrude(a, far, 0), b));
  }
  if (!b.isClosed) {
    b = extrude(b, far, 0);
  }
  if (doesNotOverlap(a, b)) {
    return { isEmpty: true };
  }
  // return fromNefPolyhedron(intersectionOfNefPolyhedrons(toNefPolyhedron(a), toNefPolyhedron(b)));
  return fromSurfaceMeshLazy(
    intersectionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

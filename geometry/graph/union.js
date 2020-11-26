import { extrude } from './extrude.js';
// import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { fromPaths } from './fromPaths.js';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { principlePlane } from './principlePlane.js';
import { section } from './section.js';
// import { toNefPolyhedron } from './toNefPolyhedron.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import {
  //  unionOfNefPolyhedrons,
  unionOfSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';

const far = 10000;

export const union = (a, b) => {
  if (a.isEmpty || b.isEmpty) {
    return a;
  }
  if (!a.isClosed) {
    if (!b.isClosed) {
      b = extrude(b, far, 0);
    }
    return fromPaths(
      section(union(extrude(a, far, 0), b), [principlePlane(a)])[0]
    );
  }
  if (!b.isClosed) {
    // The union of a surface and a solid is the solid.
    // Otherwise we'd end up with a union with the far extrusion.
    return a;
  }
  // return fromNefPolyhedron(unionOfNefPolyhedrons(toNefPolyhedron(b), toNefPolyhedron(a)));
  return fromSurfaceMeshLazy(
    unionOfSurfaceMeshes(toSurfaceMesh(a), toSurfaceMesh(b))
  );
};

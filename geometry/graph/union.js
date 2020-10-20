import { extrude } from './extrude.js';
import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { section } from './section.js';
import { toNefPolyhedron } from './toNefPolyhedron.js';
import { unionOfNefPolyhedrons } from '@jsxcad/algorithm-cgal';

const far = 10000;

export const union = (a, b) => {
  if (!a.isClosed) {
    return section(a.faces[0].plane, union(extrude(a, far, 0), b));
  }
  if (b.isClosed) {
    fromNefPolyhedron(
      unionOfNefPolyhedrons(toNefPolyhedron(b), toNefPolyhedron(a))
    );
  } else {
    // The union of a surface and a solid is the solid.
    return a;
  }
};

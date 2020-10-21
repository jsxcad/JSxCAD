import { differenceOfNefPolyhedrons } from '@jsxcad/algorithm-cgal';
import { extrude } from './extrude.js';
import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { section } from './section.js';
import { toNefPolyhedron } from './toNefPolyhedron.js';

const far = 10000;

export const difference = (a, b) => {
  if (!a.isClosed) {
    return section(a.faces[0].plane, difference(extrude(a, far, 0), b));
  }
  if (!b.isClosed) {
    b = extrude(b, far, 0);
  }
  return fromNefPolyhedron(
    differenceOfNefPolyhedrons(toNefPolyhedron(a), toNefPolyhedron(b))
  );
};

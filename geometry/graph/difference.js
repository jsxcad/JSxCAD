import { differenceOfNefPolyhedrons } from '@jsxcad/algorithm-cgal';
import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { toNefPolyhedron } from './toNefPolyhedron.js';

export const difference = (a, b) =>
  fromNefPolyhedron(
    differenceOfNefPolyhedrons(toNefPolyhedron(a), toNefPolyhedron(b))
  );

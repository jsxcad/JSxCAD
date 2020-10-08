import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { intersectionOfNefPolyhedrons } from '@jsxcad/algorithm-cgal';
import { toNefPolyhedron } from './toNefPolyhedron.js';

export const intersection = (a, b) =>
  fromNefPolyhedron(
    intersectionOfNefPolyhedrons(toNefPolyhedron(b), toNefPolyhedron(a))
  );

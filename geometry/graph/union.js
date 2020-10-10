import { fromNefPolyhedron } from './fromNefPolyhedron.js';
import { toNefPolyhedron } from './toNefPolyhedron.js';
import { unionOfNefPolyhedrons } from '@jsxcad/algorithm-cgal';

export const union = (a, b) =>
  fromNefPolyhedron(
    unionOfNefPolyhedrons(toNefPolyhedron(b), toNefPolyhedron(a))
  );

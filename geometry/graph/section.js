import {
  fromNefPolyhedronFacetsToGraph,
  sectionOfNefPolyhedron,
} from '@jsxcad/algorithm-cgal';

import { toNefPolyhedron } from './toNefPolyhedron.js';

export const section = ([x, y, z, w], graph) =>
  fromNefPolyhedronFacetsToGraph(
    sectionOfNefPolyhedron(toNefPolyhedron(graph), x, y, z, w),
    [x, y, z, w]
  );

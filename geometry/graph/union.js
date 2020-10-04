import {
  fromGraphToNefPolyhedron,
  fromNefPolyhedronToGraph,
  unionOfNefPolyhedrons,
} from '@jsxcad/algorithm-cgal';

export const union = (a, b) =>
  fromNefPolyhedronToGraph(
    unionOfNefPolyhedrons(
      fromGraphToNefPolyhedron(b),
      fromGraphToNefPolyhedron(a)
    )
  );

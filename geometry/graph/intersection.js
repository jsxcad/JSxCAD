import {
  fromGraphToNefPolyhedron,
  fromNefPolyhedronToGraph,
  intersectionOfNefPolyhedrons,
} from '@jsxcad/algorithm-cgal';

export const intersection = (a, b) =>
  fromNefPolyhedronToGraph(
    intersectionOfNefPolyhedrons(
      fromGraphToNefPolyhedron(b),
      fromGraphToNefPolyhedron(a)
    )
  );

import {
  differenceOfNefPolyhedrons,
  fromGraphToNefPolyhedron,
  fromNefPolyhedronToGraph,
} from '@jsxcad/algorithm-cgal';

export const difference = (a, b) =>
  fromNefPolyhedronToGraph(
    differenceOfNefPolyhedrons(
      fromGraphToNefPolyhedron(a),
      fromGraphToNefPolyhedron(b)
    )
  );

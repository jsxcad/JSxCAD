import { transform as transformPlane } from '@jsxcad/math-plane';
import { transform as transformPoints } from '@jsxcad/geometry-points';

// FIX: Precision loss.
export const transform = (matrix, graph) => ({
  ...graph,
  points: transformPoints(matrix, graph.points),
  faces: graph.faces.map(face => ({ ...face, plane: transformPlane(matrix, face.plane) }))
});

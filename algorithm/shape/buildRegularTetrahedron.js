import { buildConvexHull } from './buildConvexHull.js';

// Unit tetrahedron vertices.
const points = [
  [1, 1, 1],
  [-1, 1, -1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, -1],
  [1, 1, 1],
  [1, -1, -1],
  [-1, -1, 1],
  [1, 1, 1],
  [-1, -1, 1],
  [-1, 1, -1],
];

export const buildRegularTetrahedron = (options = {}) =>
  buildConvexHull(points);

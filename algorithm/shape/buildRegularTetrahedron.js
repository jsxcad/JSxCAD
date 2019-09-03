import { buildConvexHull } from './buildConvexHull';

// Unit tetrahedron vertices.
const points = [[1, 1, 1], [-1, 1, -1], [1, -1, -1],
                [-1, 1, -1], [-1, -1, 1], [1, -1, -1],
                [1, 1, 1], [1, -1, -1], [-1, -1, 1],
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1]];

export const buildRegularTetrahedron = (options = {}) => buildConvexHull(points);

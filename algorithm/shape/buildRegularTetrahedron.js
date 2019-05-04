import { buildConvexHull } from '@jsxcad/geometry-points';

// Unit tetrahedron vertices.
const points = [[1, 1, 1], [-1, 1, -1], [1, -1, -1],
                [-1, 1, -1], [-1, -1, 1], [1, -1, -1],
                [1, 1, 1], [1, -1, -1], [-1, -1, 1],
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1]];

export const buildRegularTetrahedron = (options = {}) => buildConvexHull({}, points);

import { buildConvexHull } from '@jsxcad/algorithm-points';

// Unit tetrahedron vertices.
const points = [[1, 1, 1], [-1, 1, -1], [1, -1, -1],
                [-1, 1, -1], [-1, -1, 1], [1, -1, -1],
                [1, 1, 1], [1, -1, -1], [-1, -1, 1],
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1]];

export const buildRegularTetrahedron = (options = {}) => buildConvexHull({}, points);

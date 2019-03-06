const buildConvexHull = require('./buildConvexHull');

// Unit tetrahedron vertices.
const points = [[1, 1, 1], [-1, 1, -1], [1, -1, -1],
                [-1, 1, -1], [-1, -1, 1], [1, -1, -1],
                [1, 1, 1], [1, -1, -1], [-1, -1, 1],
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1]];

const buildRegularTetrahedron = (options = {}) => buildConvexHull({}, points);

module.exports = buildRegularTetrahedron;

const vec3 = require('@jsxcad/math-vec3');

const transform = (matrix, path) => path.map((point, index) => (point === null) ? null : vec3.transform(matrix, point));

module.exports = transform;

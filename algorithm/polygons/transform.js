const poly3 = require('@jsxcad/math-poly3');

const transform = (matrix, polygons) => polygons.map(polygon => poly3.transform(matrix, polygon));

module.exports = transform;

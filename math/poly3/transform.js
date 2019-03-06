const map = require('./map');
const mat4 = require('@jsxcad/math-mat4');
const vec3 = require('@jsxcad/math-vec3');

// Affine transformation of polygon. Returns a new polygon.
const transform = (matrix, polygons) => {
  const transformed = map(polygons, vertex => vec3.transform(matrix, vertex));
  if (mat4.isMirroring(matrix)) {
    // Reverse the order to preserve the orientation.
    transformed.reverse();
  }
  return transformed;
};

module.exports = transform;

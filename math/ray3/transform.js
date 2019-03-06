const fromPointAndDirection = require('./fromPointAndDirection');
const vec3 = require('@jsxcad/math-vec3');

/**
 * Transforms the given 3D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line3} line the 3D line to transform
 * @returns {line3} a new unbounded 3D line
 */
const transform = (matrix, [point, direction]) => {
  const pointPlusDirection = vec3.add(point, direction);
  const newpoint = vec3.transform(matrix, point);
  const newPointPlusDirection = vec3.transform(matrix, pointPlusDirection);
  const newdirection = vec3.subtract(newPointPlusDirection, newpoint);
  return fromPointAndDirection(newpoint, newdirection);
};

module.exports = transform;

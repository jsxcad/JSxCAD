const fromPointAndDirection = require('./fromPointAndDirection');
const vec3 = require('@jsxcad/math-vec3');

/**
 * Create an unbounded 3D line, positioned at 0,0,0 and lying on the X axis.
 *
 * @returns {line3} a new unbounded 3D line
 */
const create = () => {
  const point = vec3.fromValues(0, 0, 0);
  const direction = vec3.fromValues(0, 0, 1);
  return fromPointAndDirection(point, direction);
};

module.exports = create;

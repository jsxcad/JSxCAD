const fromValues = require('./fromValues');
const vec2 = require('@jsxcad/math-vec2');

/**
 * Create a new 2D line that passes through the given points
 *
 * @param {vec2} p1 start point of the 2D line
 * @param {vec2} p2 end point of the 2D line
 * @returns {line2} a new unbounded 2D line
 */
const fromPoints = (p1, p2) => {
  const direction = vec2.subtract(p2, p1);
  const normal = vec2.normal(direction);
  const normalizedNormal = vec2.normalize(normal);
  const distance = vec2.dot(p1, normalizedNormal);
  return fromValues(normalizedNormal[0], normalizedNormal[1], distance);
};

module.exports = fromPoints;

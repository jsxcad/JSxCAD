const vec3 = require('@jsxcad/math-vec3');

/**
 * Determine the closest point on the given line to the given point.
 *
 * @param {vec3} point the point of reference
 * @param {line3} line the 3D line for calculations
 * @returns {vec3} a new point
 */
const closestPoint = (point, [lpoint, ldirection]) => {
  const a = vec3.dot(vec3.subtract(point, lpoint), ldirection);
  const b = vec3.dot(ldirection, ldirection);
  const t = a / b;
  return vec3.add(lpoint, vec3.scale(t, ldirection));
};

module.exports = closestPoint;

const vec3 = require('@jsxcad/math-vec3');

/**
 * Compare the given 3D lines for equality
 *
 * @return {boolean} true if lines are equal
 */
const equals = ([point1, unit1], [point2, unit2]) => {
  // compare directions (unit vectors)
  if (!vec3.equals(unit1, unit2)) return false;

  // compare points
  if (!vec3.equals(point1, point2)) return false;

  // why would lines with the same slope (direction) and different points be equal?
  // let distance = distanceToPoint(line1, line2[0])
  // if (distance > EPS) return false

  return true;
};

module.exports = equals;

const closestPoint = require('./closestPoint');
const vec3 = require('@jsxcad/math-vec3');

/**
 * Calculate the distance (positive) between the given point and line
 *
 * @param {vec3} point the point of reference
 * @param {line3} line the 3D line of reference
 * @return {Number} distance between line and point
 */
const distanceToPoint = (point, line) => {
  const closest = closestPoint(point, line);
  const distancevector = vec3.subtract(point, closest);
  return vec3.length(distancevector);
};

module.exports = distanceToPoint;

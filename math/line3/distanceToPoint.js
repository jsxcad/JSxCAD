import { length, subtract } from '@jsxcad/math-vec3';

import { closestPoint } from './closestPoint';

/**
 * Calculate the distance (positive) between the given point and line
 *
 * @param {vec3} point the point of reference
 * @param {line3} line the 3D line of reference
 * @return {Number} distance between line and point
 */
export const distanceToPoint = (point, line) => {
  const closest = closestPoint(point, line);
  const distancevector = subtract(point, closest);
  return length(distancevector);
};

import { fromPointAndDirection } from './fromPointAndDirection';
import { subtract } from '@jsxcad/math-vec3';

/**
 * Creates a new 3D line that passes through the given points.
 *
 * @param {vec3} p1 start point of the line segment
 * @param {vec3} p2 end point of the line segment
 * @returns {line3} a new unbounded 3D line
 */
export const fromPoints = (p1, p2) => {
  const direction = subtract(p2, p1);
  return fromPointAndDirection(p1, direction);
};

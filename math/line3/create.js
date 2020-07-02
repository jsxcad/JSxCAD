import { fromPointAndDirection } from './fromPointAndDirection.js';
import { fromValues } from '@jsxcad/math-vec3';

/**
 * Create an unbounded 3D line, positioned at 0,0,0 and lying on the X axis.
 *
 * @returns {line3} a new unbounded 3D line
 */
export const create = () => {
  const point = fromValues(0, 0, 0);
  const direction = fromValues(0, 0, 1);
  return fromPointAndDirection(point, direction);
};

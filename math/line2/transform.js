import { direction } from './direction.js';
import { fromPoints } from './fromPoints.js';
import { origin } from './origin.js';
import { transform as transformVec2 } from '@jsxcad/math-vec2';

/**
 * Transforms the given 2D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line2} line the 2D line to transform
 * @returns {line2} a new unbounded 2D line
 */
export const transform = (matrix, line) =>
  fromPoints(
    transformVec2(matrix, origin(line)),
    transformVec2(matrix, direction(line))
  );

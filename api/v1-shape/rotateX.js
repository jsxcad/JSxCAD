import { Shape } from './Shape.js';
import { fromXRotation } from '@jsxcad/math-mat4';

/**
 *
 * # Rotate X
 *
 * Rotates the shape around the X axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateX(90)
 * ```
 * :::
 **/

export const rotateX = (shape, angle) =>
  shape.transform(fromXRotation(angle * 0.017453292519943295));

const rotateXMethod = function (angle) {
  return rotateX(this, angle);
};
Shape.prototype.rotateX = rotateXMethod;

export default rotateX;

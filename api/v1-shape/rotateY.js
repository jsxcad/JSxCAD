import { Shape } from './Shape';
import { fromYRotation } from '@jsxcad/math-mat4';

/**
 *
 * # Rotate Y
 *
 * Rotates the shape around the Y axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateY(90)
 * ```
 * :::
 **/

export const rotateY = (shape, angle) =>
  shape.transform(fromYRotation(angle * 0.017453292519943295));

const rotateYMethod = function (angle) {
  return rotateY(this, angle);
};
Shape.prototype.rotateY = rotateYMethod;

export default rotateY;

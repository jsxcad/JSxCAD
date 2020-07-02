import { Shape } from './Shape.js';
import { fromZRotation } from '@jsxcad/math-mat4';

/**
 *
 * # Rotate Z
 *
 * Rotates the shape around the Z axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotateZ(45)
 * ```
 * :::
 **/

export const rotateZ = (shape, angle) =>
  shape.transform(fromZRotation(angle * 0.017453292519943295));

const rotateZMethod = function (angle) {
  return rotateZ(this, angle);
};
Shape.prototype.rotateZ = rotateZMethod;

export default rotateZ;

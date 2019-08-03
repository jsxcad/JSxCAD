import { Shape } from './Shape';
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

export const rotateZ = (angle, shape) => shape.transform(fromZRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateZ(angle, this); };

Shape.prototype.rotateZ = method;

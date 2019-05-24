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
 * square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * square(10).rotateY(90)
 * ```
 * :::
 **/

export const rotateY = (angle, shape) => shape.transform(fromYRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateY(angle, this); };

Shape.prototype.rotateY = method;

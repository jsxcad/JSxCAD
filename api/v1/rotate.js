import { Shape } from './Shape';
import { fromRotation } from '@jsxcad/math-mat4';

/**
 *
 * # Rotate
 *
 * Rotates the shape around the provided axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).rotate(90, [1, 1, 1])
 * ```
 * :::
 **/

export const rotate = (angle, axis, shape) => shape.transform(fromRotation(angle * 0.017453292519943295, axis));

const method = function (angle, axis) { return rotate(angle, axis, this); };

Shape.prototype.rotate = method;

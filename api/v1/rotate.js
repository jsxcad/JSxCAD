import Shape from './Shape';
import { fromRotation } from '@jsxcad/math-mat4';

/**
 *
 * # Rotate
 *
 * ```
 * rotate(shape, axis, angle)
 * shape.rotate(axis, angle)
 * ```
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
 * Square(10).rotate([1, 1, 1], 90)
 * ```
 * :::
 **/

export const rotate = (shape, axis, angle) => shape.transform(fromRotation(angle * 0.017453292519943295, axis));

const method = function (angle, axis) { return rotate(this, axis, angle); };

Shape.prototype.rotate = method;

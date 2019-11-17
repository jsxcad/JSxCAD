import Shape from './Shape';
import { negate } from '@jsxcad/math-vec3';

/**
 *
 * # Turn
 *
 * ```
 * turn(shape, axis, angle)
 * shape.turn(axis, angle)
 * ```
 *
 * Rotates the shape around its own axis.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).turn([1, 1, 1], 90)
 * ```
 * :::
 **/

export const turn = (shape, axis, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotate(axis, angle)
      .move(...center);
};

const turnMethod = function (angle, axis) { return turn(this, axis, angle); };
Shape.prototype.turn = turnMethod;

import { cross, dot, negate, normalize, subtract } from '@jsxcad/math-vec3';

import { Shape } from './Shape';

/**
 *
 * # Orient
 *
 * Orients a shape so that it moves from 'center' to 'from' and faces toward 'at', rather than 'facing'.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Square(10).orient({ from: [3, 3, 3], at: [1, 1, 1] });
 * ```
 * :::
 **/

export const orient = (shape, { center = [0, 0, 0], facing = [0, 0, 1], at = [0, 0, 0], from = [0, 0, 0] }) => {
  const normalizedFacing = normalize(facing);
  const normalizedAt = normalize(subtract(at, from));

  const angle = Math.acos(dot(normalizedFacing, normalizedAt)) * 180 / Math.PI;
  const axis = normalize(cross(normalizedFacing, normalizedAt));

  return shape
      .move(negate(center))
      .rotate(angle, axis)
      .move(from);
};

const orientMethod = function (...args) { return orient(this, ...args); };
Shape.prototype.orient = orientMethod;

orient.signature = 'orient(Shape:shape, { center:Point, facing:Vector, at:Point, from:Point }) -> Shape';
orientMethod.signature = 'Shape -> orient({ center:Point, facing:Vector, at:Point, from:Point }) -> Shape';

export default orient;

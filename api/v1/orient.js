import { cross, dot, negate, normalize, subtract } from '@jsxcad/math-vec3';

import { Shape } from './Shape';
import { fromRotation } from '@jsxcad/math-mat4';

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

export const orient = ({ center = [0, 0, 0], facing = [0, 0, 1], at = [0, 0, 0], from = [0, 0, 0] }, shape) => {
  const normalizedFrom = normalize(from);
  const normalizedFacing = normalize(facing);
  const normalizedAt = normalize(subtract(at, from));

  const angle = Math.acos(dot(normalizedFacing, normalizedAt)) * 180 / Math.PI;
  const axis = normalize(cross(normalizedFacing, normalizedAt));

  return shape
           .move(negate(center))
           .rotate(angle, axis)
           .move(from);
}

const method = function (options = {}) { return orient(options, this); };

Shape.prototype.orient = method;

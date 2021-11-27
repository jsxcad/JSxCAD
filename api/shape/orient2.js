import { cross, dot, negate, normalize, subtract } from '@jsxcad/math-vec3';
import { Shape } from './Shape.js';

// Deprecated
export const orient2 =
  ({
    center = [0, 0, 0],
    facing = [0, 0, 1],
    at = [0, 0, 0],
    from = [0, 0, 0],
  }) =>
  (shape) => {
    const normalizedFacing = normalize(facing);
    const normalizedAt = normalize(subtract(at, from));

    const angle =
      (Math.acos(dot(normalizedFacing, normalizedAt)) * 180) / Math.PI;
    const axis = normalize(cross(normalizedFacing, normalizedAt));

    return shape
      .move(...negate(center))
      .rotate(angle, axis)
      .move(...from);
  };

Shape.registerMethod('orient2', orient2);

export default orient2;

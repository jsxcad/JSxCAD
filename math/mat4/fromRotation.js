import { identity } from './identity';

const EPSILON = 1e-5;

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
export const fromRotation = (rad, [x, y, z]) => {
  let len = Math.sqrt(x * x + y * y + z * z);

  if (Math.abs(len) < EPSILON) {
    return identity();
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const t = 1 - c;

  // Perform rotation-specific matrix multiplication
  return [x * x * t + c,
          y * x * t + z * s,
          z * x * t - y * s,
          0,
          x * y * t - z * s,
          y * y * t + c,
          z * y * t + x * s,
          0,
          x * z * t + y * s,
          y * z * t - x * s,
          z * z * t + c,
          0,
          0,
          0,
          0,
          1];
};

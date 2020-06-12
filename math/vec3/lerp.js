/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {Number} t interpolant (0.0 to 1.0) applied between the two inputs
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
export const lerp = (t, [ax, ay, az], [bx, by, bz]) => [
  ax + t * (bx - ax),
  ay + t * (by - ay),
  az + t * (bz - az),
];

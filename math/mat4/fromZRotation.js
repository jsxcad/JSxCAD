/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
export const fromZRotation = (rad) => {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  // Perform axis-specific matrix multiplication
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

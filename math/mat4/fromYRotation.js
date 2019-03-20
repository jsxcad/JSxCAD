/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
export const fromYRotation = (rad) => {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  // Perform axis-specific matrix multiplication
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};

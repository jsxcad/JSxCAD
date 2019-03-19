/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
export const distance = ([ax, ay], [bx, by]) => {
  const x = bx - ax;
  const y = by - ay;
  return Math.sqrt(x * x + y * y);
};

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
export const squaredDistance = ([ax, ay], [bx, by]) => {
  const x = bx - ax;
  const y = by - ay;
  return x * x + y * y;
};

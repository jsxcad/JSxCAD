/**
 * Scales the length of a vector by some amount.
 *
 * @param {number} the amount to scale
 * @param {vec3} the vector to scale
 * @returns {vec3}
 */
export const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

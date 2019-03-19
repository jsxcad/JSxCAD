/**
 * Scales a vec2 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec2} vector the vector to scale
 * @returns {vec2} out
 */
export const scale = (amount, [x, y]) => [x * amount, y * amount];

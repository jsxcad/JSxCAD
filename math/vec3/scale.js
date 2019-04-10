/**
 * Scales a vec3 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec3} vector the vector to scale
 * @returns {vec3} out
 */
export const scale = (amount, [x, y, z]) => [(x * amount), (y * amount), (z * amount)];

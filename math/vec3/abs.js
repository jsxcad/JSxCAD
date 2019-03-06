/**
 * Calculates the absolute value of the give vector
 *
 * @param {vec3} [out] - receiving vector
 * @param {vec3} vec - given value
 * @returns {vec3} absolute value of the vector
 */
const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];

module.exports = abs;

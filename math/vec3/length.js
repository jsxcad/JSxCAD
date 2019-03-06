/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = ([x, y, z]) => Math.sqrt((x * x) + (y * y) + (z * z));

module.exports = length;

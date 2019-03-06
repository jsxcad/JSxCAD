/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = ([x, y]) => Math.sqrt((x * x) + (y * y));

module.exports = length;

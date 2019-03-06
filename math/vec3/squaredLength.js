/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
const squaredLength = ([x, y, z]) => (x * x) + (y * y) + (z * z);

module.exports = squaredLength;

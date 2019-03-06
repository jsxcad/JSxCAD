/**
 * Scales a vec2 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec2} vector the vector to scale
 * @returns {vec2} out
 */
const scale = (amount, vector) => [vector[0] * amount, vector[1] * amount];

module.exports = scale;

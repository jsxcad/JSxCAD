/**
 * Scales a vec3 by a scalar number
 *
 * @param {Number} amount amount to scale the vector by
 * @param {vec3} vector the vector to scale
 * @returns {vec3} out
 */
const scale = (amount, vector) => [vector[0] * amount,
                                   vector[1] * amount,
                                   vector[2] * amount];

module.exports = scale;

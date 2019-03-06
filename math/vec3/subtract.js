/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
const subtract = (a, b) => [a[0] - b[0],
                            a[1] - b[1],
                            a[2] - b[2]];

module.exports = subtract;

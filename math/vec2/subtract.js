/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1]];

module.exports = subtract;

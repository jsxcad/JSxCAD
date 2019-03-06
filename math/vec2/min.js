/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const min = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1])];

module.exports = min;

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const max = (a, b) => [Math.max(a[0], b[0]), Math.max(a[1], b[1])];

module.exports = max;

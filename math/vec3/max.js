/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
const max = (a, b) => [Math.max(a[0], b[0]),
                       Math.max(a[1], b[1]),
                       Math.max(a[2], b[2])];

module.exports = max;

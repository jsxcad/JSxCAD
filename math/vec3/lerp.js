/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {Number} t interpolant (0.0 to 1.0) applied between the two inputs
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
const lerp = (t, a, b) => [a[0] + t * (b[0] - a[0]),
                           a[1] + t * (b[1] - a[1]),
                           a[2] + t * (b[2] - a[2])];

module.exports = lerp;

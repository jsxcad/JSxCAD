/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {Number} t interpolation amount between the two inputs
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const lerp = (t, [ax, ay], [bx, by]) => [ax + t * (bx - ax),
                                         ay + t * (by - ay)];

module.exports = lerp;

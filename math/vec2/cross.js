/**
 * Computes the cross product (3D) of two vectors
 *
 * @param {vec3} out : the receiving vec3 (IMPORTANT)
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} cross product
 */
// Alternatively return vec3.cross(out, vec3.fromVec2(a), vec3.fromVec2(b))
const cross = (a, b) => [0, 0, a[0] * b[1] - a[1] * b[0]];

module.exports = cross;

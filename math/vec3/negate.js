/**
 * Negates the components of a vec3
 *
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
const negate = ([x, y, z]) => [-x, -y, -z];

module.exports = negate;

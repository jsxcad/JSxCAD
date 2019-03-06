/**
 * Flip the given plane (vec4)
 *
 * @param {vec4} vec - plane to flip
 * @return {vec4} flipped plane
 */
const flip = ([x, y, z, w]) => [-x, -y, -z, -w];

module.exports = flip;

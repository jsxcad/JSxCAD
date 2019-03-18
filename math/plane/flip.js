/**
 * Flip the given plane (vec4)
 *
 * @param {vec4} vec - plane to flip
 * @return {vec4} flipped plane
 */
export const flip = ([x = 0, y = 0, z = 0, w = 0]) => [-x, -y, -z, -w];

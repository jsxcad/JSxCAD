/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first vec4
 * @param {vec4} b the second vec4
 * @returns {Number} dot product of a and b
 */
export const dot = ([ax, ay, az, aw], [bx, by, bz, bw]) => (ax * bx) + (ay * by) + (az * bz) + (aw * bw);

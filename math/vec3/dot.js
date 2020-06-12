/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
export const dot = ([ax, ay, az], [bx, by, bz]) => ax * bx + ay * by + az * bz;

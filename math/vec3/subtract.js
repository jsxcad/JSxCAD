/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
export const subtract = ([ax, ay, az], [bx, by, bz]) => [(ax - bx), (ay - by), (az - bz)];

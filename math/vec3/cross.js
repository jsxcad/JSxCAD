/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
export const cross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by,
                                                      az * bx - ax * bz,
                                                      ax * by - ay * bx];

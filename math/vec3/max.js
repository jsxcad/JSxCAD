/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
export const max = ([ax, ay, az], [bx, by, bz]) => [Math.max(ax, bx),
                                                    Math.max(ay, by),
                                                    Math.max(az, bz)];

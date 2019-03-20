/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
export const min = ([ax, ay, az], [bx, by, bz]) => [Math.min(ax, bx),
                                                    Math.min(ay, by),
                                                    Math.min(az, bz)];

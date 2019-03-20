/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
export const min = ([ax, ay], [bx, by]) => [Math.min(ax, bx), Math.min(ay, by)];

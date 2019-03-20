/**
 * Creates a new vec3 initialized with the given values
 * Any missing ranks are implicitly zero.
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec3} a new 2D vector
 */
export const fromValues = (x = 0, y = 0) => [x, y];

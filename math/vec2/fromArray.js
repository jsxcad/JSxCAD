/**
 * Produces a well formed vec3 from an array of values.
 * Any missing ranks are implicitly zero.
 * @param {Array} data array of numerical values
 * @returns {vec2} a new 2D vector
 */
export const fromArray = ([x = 0, y = 0]) => [x, y];

/**
 * Creates a new vec2 from the point given.
 * Missing ranks are implicitly zero.
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
const fromPoint = ([x = 0, y = 0]) => [x, y];

module.exports = fromPoint;

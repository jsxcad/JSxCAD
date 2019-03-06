const fromPointAndDirection = require('./fromPointAndDirection');
const vec3 = require('@jsxcad/math-vec3');

/**
 * Create a new line in the opposite direction as the given.
 *
 * @param {line3} line the 3D line to reverse
 * @returns {line3} a new unbounded 3D line
 */
const reverse = ([point, unitDirection]) => fromPointAndDirection(point, vec3.negate(unitDirection));

module.exports = reverse;

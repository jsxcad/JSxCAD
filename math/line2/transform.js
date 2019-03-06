const direction = require('./direction');
const fromPoints = require('./fromPoints');
const origin = require('./origin');
const vec2 = require('@jsxcad/math-vec2');

/**
 * Transforms the given 2D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line2} line the 2D line to transform
 * @returns {line2} a new unbounded 2D line
 */
const transform = (matrix, line) => fromPoints(vec2.transform(matrix, origin(line)),
                                               vec2.transform(matrix, direction(line)));

module.exports = transform;

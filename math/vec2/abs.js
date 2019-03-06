const fromValues = require('./fromValues');

/**
 * Calculates the absolute value of the give vector
 *
 * @param {vec2} vec - given value
 * @returns {vec2} absolute value of the vector
 */
const abs = (vec) => fromValues(Math.abs(vec[0]), Math.abs(vec[1]));

module.exports = abs;

const fromValues = require('./fromValues');

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} vec - given vector to clone
 * @returns {vec2} clone of the vector
 */
const clone = (vec) => fromValues(vec[0], vec[1]);

module.exports = clone;

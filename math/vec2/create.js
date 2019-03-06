const fromValues = require('./fromValues');

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
const create = () => fromValues(0, 0);

module.exports = create;

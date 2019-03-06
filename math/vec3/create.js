const fromValues = require('./fromValues');

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
const create = () => fromValues(0, 0, 0);

module.exports = create;

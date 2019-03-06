const fromValues = require('./fromValues');

/**
 * Adds two vec3's
 *
 * @param {vec3} a the first vector to add
 * @param {vec3} b the second vector to add
 * @returns {vec3} the added vectors
 */
const add = (a, b) => fromValues(a[0] + b[0], a[1] + b[1], a[2] + b[2]);

module.exports = add;

const fromValues = require('./fromValues');

/**
 * Adds two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const add = (a, b) => fromValues(a[0] + b[0], a[1] + b[1]);

module.exports = add;

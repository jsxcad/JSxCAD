/**
 * Creates a new vec3 from the point given.
 * Missing ranks are implicitly zero.
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
const fromPoint = ([x = 0, y = 0, z = 0]) => [x, y, z];

module.exports = fromPoint;

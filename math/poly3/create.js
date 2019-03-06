const map = require('./map');

/**
 * Represents a convex polygon. The vertices used to initialize a polygon must
 *   be coplanar and form a convex loop. They do not have to be `vec3`
 *   instances but they must behave similarly.
 *
 * @constructor
 * @param {vec3[]} vertices - list of vertices
 *
 * @example
 * const vertices = [ [0, 0, 0], [0, 10, 0], [0, 10, 10] ]
 * let observed = poly3.fromPoints(vertices)
 */

/**
 * Creates a new poly3 (polygon) with initial values
 *
 * @returns {poly3} a new poly3
 */
const create = () => map();

module.exports = create;

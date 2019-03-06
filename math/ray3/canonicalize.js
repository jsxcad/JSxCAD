const vec3 = require('@jsxcad/math-vec3');

/**
 * Produce a canonical version of a ray3.
 * @param {ray3} the ray
 * @returns {ray3} the canonical ray3
 */
const canonicalize = ([point, unitDirection]) => [vec3.canonicalize(point), vec3.canonicalize(unitDirection)];

module.exports = canonicalize;

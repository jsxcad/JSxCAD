const vec3 = require('@jsxcad/math-vec3');

const W = 3;

/**
 * Calculate the distance to the given point
 * @return {Number} signed distance to point
 */
const signedDistanceToPoint = (plane, vector) => vec3.dot(plane, vector) - plane[W];

module.exports = signedDistanceToPoint;

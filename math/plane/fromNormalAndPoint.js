const vec3 = require('@jsxcad/math-vec3');

/**
 * Create a new plane from the given normal and point values
 * @param {Vec3} normal  - vector 3D
 * @param {Vec3}  point- vector 3D
 * @returns {Array} a new plane with properly typed values
 */
const fromNormalAndPoint = (normal, point) => {
  const u = vec3.unit(normal);
  const w = vec3.dot(point, u);
  return [u[0], u[1], u[2], w];
};

module.exports = fromNormalAndPoint;

import { dot, unit } from '@jsxcad/math-vec3';

/**
 * Create a new plane from the given normal and point values
 * @param {Vec3} normal  - vector 3D
 * @param {Vec3}  point- vector 3D
 * @returns {Array} a new plane with properly typed values
 */
export const fromNormalAndPoint = (normal, point) => {
  const u = unit(normal);
  const w = dot(point, u);
  return [u[0], u[1], u[2], w];
};

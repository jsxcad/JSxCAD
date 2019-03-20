import { cross, dot, subtract, unit } from '@jsxcad/math-vec3';

/**
 * Create a new plane from the given points
 *
 * @param {Vec3} a - 3D point
 * @param {Vec3} b - 3D point
 * @param {Vec3} c - 3D point
 * @returns {Vec4} a new plane with properly typed values
 */
export const fromPoints = (a, b, c) => {
  // let n = b.minus(a).cross(c.minus(a)).unit()
  // FIXME optimize later
  const ba = subtract(b, a);
  const ca = subtract(c, a);
  const cr = cross(ba, ca);
  const normal = unit(cr); // normal part
  //
  const w = dot(normal, a);
  return [normal[0], normal[1], normal[2], w];
};

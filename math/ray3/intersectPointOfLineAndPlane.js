import { add, dot, scale } from '@jsxcad/math-vec3';

/**
 * Determine the closest point on the given plane to the given line.
 *
 * The point of intersection will be invalid if parallel to the plane, e.g. NaN.
 *
 * @param {plane} plane the plane of reference
 * @param {line3} line the 3D line of reference
 * @returns {vec3} a new point
 */
export const intersectPointOfLineAndPlane = (plane, line) => {
  // plane: plane.normal * p = plane.w
  const pnormal = plane;
  const pw = plane[3];

  const lpoint = line[0];
  const ldirection = line[1];

  // point: p = line.point + labda * line.direction
  const lambda = (pw - dot(pnormal, lpoint)) / dot(pnormal, ldirection);

  const point = add(lpoint, scale(lambda, ldirection));
  return point;
};

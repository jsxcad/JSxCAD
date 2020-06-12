import { add, dot, scale } from "@jsxcad/math-vec3";

const W = 3;

/**
 * Determine the closest point on the given plane to the given line.
 *
 * The point of intersection will be invalid if parallel to the plane, e.g. NaN.
 *
 * @param {plane} plane the plane of reference
 * @param {line3} line the 3D line of reference
 * @returns {vec3} a new point
 */
export const intersectPointOfLineAndPlane = (plane, [origin, direction]) => {
  // plane: plane.normal * p = plane.w
  const pw = plane[W];

  // point: p = line.point + labda * line.direction
  const lambda = (pw - dot(plane, origin)) / dot(plane, direction);

  const point = add(origin, scale(lambda, direction));
  return point;
};

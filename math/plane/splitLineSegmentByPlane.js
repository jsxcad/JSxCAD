import { add, dot, scale, subtract } from "@jsxcad/math-vec3";

/**
 * Split the given line by the given plane.
 * Robust splitting, even if the line is parallel to the plane
 * @return {vec3} a new point
 */
export const splitLineSegmentByPlane = (plane, p1, p2) => {
  const direction = subtract(p2, p1);
  let lambda = (plane[3] - dot(plane, p1)) / dot(plane, direction);
  if (Number.isNaN(lambda)) lambda = 0;
  if (lambda > 1) lambda = 1;
  if (lambda < 0) lambda = 0;
  return add(p1, scale(lambda, direction));
};

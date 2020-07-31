import { add, dot, scale, subtract } from '@jsxcad/math-vec3';

const W = 3;
/**
 * Split the given line by the given plane.
 * Robust splitting, even if the line is parallel to the plane
 * @type {function(plane:Plane, start:Point, end:Point):Point}
 */
export const splitLineByPlane = (plane, start, end) => {
  const direction = subtract(end, start);
  const lambda = (plane[W] - dot(plane, start)) / dot(plane, direction);
  if (Number.isNaN(lambda)) {
    return start;
  }
  return add(start, scale(lambda, direction));
};

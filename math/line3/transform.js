import { add, subtract, transform as transformVec3 } from "@jsxcad/math-vec3";

import { fromPointAndDirection } from "./fromPointAndDirection";

/**
 * Transforms the given 3D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line3} line the 3D line to transform
 * @returns {line3} a new unbounded 3D line
 */
export const transform = (matrix, [point, direction]) => {
  const pointPlusDirection = add(point, direction);
  const newpoint = transformVec3(matrix, point);
  const newPointPlusDirection = transformVec3(matrix, pointPlusDirection);
  const newdirection = subtract(newPointPlusDirection, newpoint);
  return fromPointAndDirection(newpoint, newdirection);
};

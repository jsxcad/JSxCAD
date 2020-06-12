import { cross, dot, length, random, subtract, unit } from "@jsxcad/math-vec3";
import { fromValues } from "@jsxcad/math-mat4";

const EPS = 1e-5;

/** Create a new plane from the given points like fromPoints,
 * but allow the vectors to be on one point or one line
 * in such a case a random plane through the given points is constructed
 * @param {Vec3} a - 3D point
 * @param {Vec3} b - 3D point
 * @param {Vec3} c - 3D point
 * @returns {Vec4} a new plane with properly typed values
 */
export const fromPointsRandom = (a, b, c) => {
  let v1 = subtract(b, a);
  let v2 = subtract(c, a);
  if (length(v1) < EPS) {
    v1 = random(v2);
  }
  if (length(v2) < EPS) {
    v2 = random(v1);
  }
  let normal = cross(v1, v2);
  if (length(normal) < EPS) {
    // this would mean that v1 == v2.negated()
    v2 = random(v1);
    normal = cross(v1, v2);
  }
  normal = unit(normal);
  return fromValues(normal[0], normal[1], normal[2], dot(normal, a));
};

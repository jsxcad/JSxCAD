import { add, dot, scale, subtract } from "@jsxcad/math-vec3";

/**
 * Determine the closest point on the given line to the given point.
 *
 * @param {vec3} point the point of reference
 * @param {line3} line the 3D line for calculations
 * @returns {vec3} a new point
 */
export const closestPoint = (point, [lpoint, ldirection]) => {
  const a = dot(subtract(point, lpoint), ldirection);
  const b = dot(ldirection, ldirection);
  const t = a / b;
  return add(lpoint, scale(t, ldirection));
};

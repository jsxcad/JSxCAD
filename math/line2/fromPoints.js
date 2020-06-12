import { dot, normal, normalize, subtract } from "@jsxcad/math-vec2";

import { fromValues } from "./fromValues";

/**
 * Create a new 2D line that passes through the given points
 *
 * @param {vec2} p1 start point of the 2D line
 * @param {vec2} p2 end point of the 2D line
 * @returns {line2} a new unbounded 2D line
 */
export const fromPoints = (p1, p2) => {
  const direction = subtract(p2, p1);
  const normalizedNormal = normalize(normal(direction));
  const distance = dot(p1, normalizedNormal);
  return fromValues(normalizedNormal[0], normalizedNormal[1], distance);
};

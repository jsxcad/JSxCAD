import { dot } from "./dot";
import { normalize } from "./normalize";
import { reallyQuantizeForSpace as q } from "@jsxcad/math-utils";

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
export const angle = (a, b) => {
  const cosine = q(dot(normalize(a), normalize(b)));
  return cosine > 1.0 ? 0 : Math.acos(cosine);
};

import { add } from "./add";
import { subtract } from "./subtract";

/**
 * Rotate vector 3D vector around the y-axis
 * @param {Number} angle The angle of rotation
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to turn
 * @returns {vec3} out
 */
export const turnY = (angle, origin, vector) => {
  const p = subtract(vector, origin);
  // turn
  const r = [
    p[2] * Math.sin(angle) + p[0] * Math.cos(angle),
    p[1],
    p[2] * Math.cos(angle) - p[0] * Math.sin(angle),
  ];
  // translate
  return add(r, origin);
};

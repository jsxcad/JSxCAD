import { add } from './add';
import { subtract } from './subtract';

/**
 * Rotate vector 3D vector around the z-axis
 * @param {Number} angle The angle of rotation in radians
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to turn
 * @returns {vec3} out
 */
export const turnZ = (angle, origin, vector) => {
  const p = subtract(vector, origin);
  // turn
  const r = [
    p[0] * Math.cos(angle) - p[1] * Math.sin(angle),
    p[0] * Math.sin(angle) + p[1] * Math.cos(angle),
    p[2],
  ];
  // translate
  return add(r, origin);
};

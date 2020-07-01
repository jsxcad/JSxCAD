import { add } from './add.js';
import { subtract } from './subtract.js';

/**
 * Rotate vector 3D vector around the x-axis
 * @param {Number} angle The angle of rotation
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
export const turnX = (angle, origin, vector) => {
  const p = subtract(vector, origin);
  // rotate
  const r = [
    p[0],
    p[1] * Math.cos(angle) - p[2] * Math.sin(angle),
    p[1] * Math.sin(angle) + p[2] * Math.cos(angle),
  ];
  // translate
  return add(r, origin);
};

import { scale } from './scale.js';

/**
 * Normalize a vec3
 *
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
export const normalize = (a) => {
  const [x, y, z] = a;
  const len = x * x + y * y + z * z;
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

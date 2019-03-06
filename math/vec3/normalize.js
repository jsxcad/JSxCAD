const scale = require('./scale');

/**
 * Normalize a vec3
 *
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
const normalize = (a) => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const len = (x * x) + (y * y) + (z * z);
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

module.exports = normalize;

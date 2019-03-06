const dot = require('./dot');
const normalize = require('./normalize');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
const angle = (a, b) => {
  const cosine = q(dot(normalize(a), normalize(b)));
  return cosine > 1.0 ? 0 : Math.acos(cosine);
};

module.exports = angle;

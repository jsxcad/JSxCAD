const add = require('./add');
const subtract = require('./subtract');

/**
 * Rotate vector 3D vector around the z-axis
 * @param {Number} angle The angle of rotation in radians
 * @param {vec3} origin The origin of the rotation
 * @param {vec3} vector The vec3 point to rotate
 * @returns {vec3} out
 */
const rotateZ = (angle, origin, vector) => {
  const p = subtract(vector, origin);
  // rotate
  const r = [p[0] * Math.cos(angle) - p[1] * Math.sin(angle),
             p[0] * Math.sin(angle) + p[1] * Math.cos(angle),
             p[2]];
  // translate
  return add(r, origin);
};

module.exports = rotateZ;

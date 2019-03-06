const create = require('./create');

/**
 * m the mat4 by the dimensions in the given vec3
 * create an affine matrix for mirroring into an arbitrary plane:
 *
 * @param {vec3} v the vec3 to mirror the matrix by
 * @param {mat4} a the matrix to mirror
 * @returns {mat4} out
 */
const mirror = ([x, y, z], a) => {
  const out = create();
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
};

module.exports = mirror;

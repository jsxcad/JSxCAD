const create = require('./create');

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {vec3} vector the vec3 to scale the matrix by
 * @param {mat4} matrix the matrix to scale
 * @returns {mat4} out
 */
const scale = ([x, y, z], matrix) => {
  const out = create();

  out[0] = matrix[0] * x;
  out[1] = matrix[1] * x;
  out[2] = matrix[2] * x;
  out[3] = matrix[3] * x;
  out[4] = matrix[4] * y;
  out[5] = matrix[5] * y;
  out[6] = matrix[6] * y;
  out[7] = matrix[7] * y;
  out[8] = matrix[8] * z;
  out[9] = matrix[9] * z;
  out[10] = matrix[10] * z;
  out[11] = matrix[11] * z;
  out[12] = matrix[12];
  out[13] = matrix[13];
  out[14] = matrix[14];
  out[15] = matrix[15];
  return out;
};

module.exports = scale;

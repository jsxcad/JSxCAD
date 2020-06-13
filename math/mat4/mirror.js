/**
 * m the mat4 by the dimensions in the given vec3
 * create an affine matrix for mirroring into an arbitrary plane:
 *
 * @param {vec3} v the vec3 to mirror the matrix by
 * @param {mat4} a the matrix to mirror
 * @returns {mat4} out
 */
export const mirror = ([x, y, z], a) => [
  a[0] * x,
  a[1] * x,
  a[2] * x,
  a[3] * x,
  a[4] * y,
  a[5] * y,
  a[6] * y,
  a[7] * y,
  a[8] * z,
  a[9] * z,
  a[10] * z,
  a[11] * z,
  a[12],
  a[13],
  a[14],
  a[15],
];

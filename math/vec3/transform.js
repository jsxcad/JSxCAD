/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 * @param {[[<vec3>], <mat4> , <vec3>]} params
 * @param {mat4} params[1] matrix matrix to transform with
 * @param {vec3} params[2] vector the vector to transform
 * @returns {vec3} out
 */
export const transform = (matrix, [x = 0, y = 0, z = 0]) => {
  if (!matrix) {
    return [x, y, z];
  }
  let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  w = w || 1.0;
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w,
  ];
};

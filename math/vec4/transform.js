/**
 * Transform the given vec4 using the given mat4
 *
 * @param {mat4} matrix matrix to transform with
 * @param {vec4} vector the vector to transform
 * @returns {vec4} a new vector or the receiving vector
 */
// PROVE: Why do we use fround here?
export const transform = (matrix, [x, y, z, w]) =>
  [Math.fround(matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w),
   Math.fround(matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w),
   Math.fround(matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w),
   Math.fround(matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w)];

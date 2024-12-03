export { toApproximateMatrix } from '@jsxcad/algorithm-cgal';
export { transform } from './tagged/transform.js';

export const transformCoordinate = ([x = 0, y = 0, z = 0], matrix) => {
  if (!matrix) {
    return [x, y, z];
  }
  let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] || 1.0;
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w,
  ];
};

export const transformingCoordinates =
  (matrix, op) =>
  (coordinate, ...args) =>
    op(transformCoordinate(coordinate, matrix), ...args);

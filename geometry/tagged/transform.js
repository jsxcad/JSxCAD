import { composeTransforms } from '@jsxcad/algorithm-cgal';
import { rewrite } from './visit.js';

export const transform = (geometry, matrix) => {
  const op = (geometry, descend, walk) =>
    descend({
      matrix: geometry.matrix
        ? composeTransforms(matrix, geometry.matrix)
        : matrix,
    });
  return rewrite(geometry, op);
};

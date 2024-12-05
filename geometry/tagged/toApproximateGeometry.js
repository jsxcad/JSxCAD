import { rewrite } from './visit.js';
import { toApproximateMatrix } from '@jsxcad/algorithm-cgal';

export const toApproximateGeometry = (geometry) => {
  const op = (geometry, descend) =>
    descend({ matrix: toApproximateMatrix(geometry.matrix) });
  return rewrite(geometry, op);
};

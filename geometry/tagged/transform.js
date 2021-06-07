import { composeTransforms } from '@jsxcad/algorithm-cgal';
import { rewrite } from './visit.js';

export const transform = (matrix, geometry) => {
  const op = (geometry, descend, walk) => {
    switch (geometry.type) {
      // Branch
      case 'assembly':
      case 'layout':
      case 'layers':
      case 'item':
      case 'sketch':
      case 'disjointAssembly':
        return descend();
      // Leaf
      case 'plan':
      case 'triangles':
      case 'paths':
      case 'points':
      case 'graph':
        return descend({
          matrix: geometry.matrix
            ? composeTransforms(matrix, geometry.matrix)
            : matrix,
        });
      default:
        throw Error(
          `Unexpected geometry ${geometry.type} see ${JSON.stringify(geometry)}`
        );
    }
  };
  return rewrite(geometry, op);
};

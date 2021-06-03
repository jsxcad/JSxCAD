import { composeTransforms } from '@jsxcad/algorithm-cgal';
import { identityMatrix } from '@jsxcad/math-mat4';
import { rewrite } from './visit.js';

export const transform = (matrix, geometry) => {
  const op = (geometry, descend, walk, matrix) => {
    switch (geometry.type) {
      // Branch
      case 'assembly':
      case 'layout':
      case 'layers':
      case 'item':
      case 'sketch':
      case 'disjointAssembly':
        return descend(matrix, geometry);
      // Leaf
      case 'plan':
        // If a plan has content, it is a branch.
        if (geometry.content) {
          return descend(matrix, geometry);
        }
      // Otherwise it is a leaf.
      // fallthrough
      case 'triangles':
      case 'paths':
      case 'points':
      case 'graph':
        const composedMatrix = composeTransforms(
          matrix,
          geometry.matrix || identityMatrix
        );
        return descend(
          {
            matrix: composedMatrix,
          },
          composedMatrix
        );
      default:
        throw Error(
          `Unexpected geometry ${geometry.type} see ${JSON.stringify(geometry)}`
        );
    }
  };
  return rewrite(geometry, op, identityMatrix);
};

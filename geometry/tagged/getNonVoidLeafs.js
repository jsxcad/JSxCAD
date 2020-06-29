import { isNotVoid } from './isNotVoid';
import { visit } from './visit';

// Retrieve leaf geometry.

export const getNonVoidLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'layout':
        return descend();
      default:
        if (isNotVoid(geometry)) {
          leafs.push(geometry);
        }
    }
  };
  visit(geometry, op);
  return leafs;
};

import { isNotVoid } from './isNotVoid.js';
import { visit } from './visit.js';

// Retrieve leaf geometry.

export const getNonVoidLeafs = (geometry) => {
  const leafs = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
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

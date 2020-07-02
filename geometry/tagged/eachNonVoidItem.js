import { isNotVoid } from './isNotVoid.js';
import { visit } from './visit.js';

export const eachNonVoidItem = (geometry, op) => {
  const walk = (geometry, descend) => {
    if (isNotVoid(geometry)) {
      op(geometry);
      descend();
    }
  };
  visit(geometry, walk);
};

import { isNotVoid } from './isNotVoid.js';
import { visit } from './visit.js';

export const eachNonVoidItem = (geometry, op) => {
  const walk = (geometry, descend) => {
    // FIX: Sketches aren't real either -- but this is a bit unclear.
    if (geometry.type !== 'sketch' && isNotVoid(geometry)) {
      op(geometry);
      descend();
    }
  };
  visit(geometry, walk);
};

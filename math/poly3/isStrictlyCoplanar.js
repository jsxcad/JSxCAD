import { equals } from '@jsxcad/math-plane';
import { toPlane } from './toPlane';

export const isStrictlyCoplanar = (polygon) => {
  const plane = toPlane(polygon);
  for (let nth = 1; nth < polygon.length - 2; nth++) {
    if (!equals(plane, toPlane(polygon.slice(nth)))) {
      return false;
    }
  }
  return true;
};

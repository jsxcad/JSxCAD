import { equals } from '@jsxcad/math-plane';
import { toPlane } from './toPlane';

export const isCoplanar = (polygon) => {
  const plane = toPlane(polygon);
  for (let nth = 1; nth < polygon.length - 2; nth++) {
    if (!equals(plane, toPlane(polygon.slice(nth)))) {
      console.log(`QQ/math/poly3/isCoplanar: false ${JSON.stringify(polygon)}`);
      return false;
    }
  }
  return true;
};

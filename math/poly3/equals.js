import { equals as equalsPlane } from '@jsxcad/math-plane';
import { equals as equalsVec3 } from '@jsxcad/math-vec3';
import { toPlane } from './toPlane';

/**
 * Compare two polygons for equality
 * @param (poly3} poly1 - polygon with plane and vertices
 * @param (poly3} poly2 - polygon with plane and vertices
 * @returns {boolean} result of comparison
 */
export const equals = (poly1, poly2) => {
  if (poly1.length !== poly2.length) {
    return false;
  }
  if (!equalsPlane(toPlane(poly1), toPlane(poly2))) {
    return false;
  }
  for (let nth = 0; nth < poly1.length; nth++) {
    if (!equalsVec3(poly1[nth], poly2[nth])) {
      return false;
    }
  }
  return true;
};

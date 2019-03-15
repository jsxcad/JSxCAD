import { canonicalize as canonicalizeOfPoly3 } from '@jsxcad/math-poly3';
import { equals } from '@jsxcad/math-vec3';

const isDegenerate = (polygon) => {
  for (let nth = 0; nth < polygon.length; nth++) {
    if (equals(polygon[nth], polygon[(nth + 1) % polygon.length])) {
      return true;
    }
  }
  return false;
}

export const canonicalize = (polygons) => {
  const canonicalized = [];
  for (let polygon of polygons) {
    polygon = canonicalizeOfPoly3(polygon);
    if (!isDegenerate(polygon)) {
      canonicalized.push(polygon);
    }
  }
  return canonicalized;
}

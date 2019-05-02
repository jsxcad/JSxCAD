import { isCoplanar } from '@jsxcad/math-poly3';

const assertCoplanarPolygon = (polygon) => {
  if (!isCoplanar(polygon)) {
    throw Error(`die`);
  }
};

export const assertCoplanar = (surface) => {
  for (const polygon of surface) {
    assertCoplanarPolygon(polygon);
  }
};

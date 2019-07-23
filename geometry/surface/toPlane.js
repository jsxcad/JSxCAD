import { toPlane as toPlaneOfPolygon } from '@jsxcad/math-poly3';

export const toPlane = (surface) => {
  for (const polygon of surface) {
    const plane = toPlaneOfPolygon(polygon);
    if (!isNaN(plane[0])) {
      return plane;
    }
  }
  throw Error('die');
}

import { signedDistanceToPoint as planeDistance } from '@jsxcad/math-plane';
import { toPlane } from '@jsxcad/math-poly3';

const assertCoplanarPolygon = (polygon) => {
  const plane = toPlane(polygon);
  for (const point of polygon) {
    if (planeDistance(plane, point) > 1e-5) {
      throw Error(`die: ${JSON.stringify(polygon)} ${planeDistance(plane, point)}`);
    }
  }
};

export const assertCoplanar = (surface) => {
  for (const polygon of surface) {
    assertCoplanarPolygon(polygon);
  }
};

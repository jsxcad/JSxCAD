import { fromPoints } from '@jsxcad/math-plane';

export const toPlane = (polygon) => {
  if (polygon.plane === undefined) {
    if (polygon.length >= 3) {
      polygon.plane = fromPoints(...polygon);
    } else {
      throw Error('die');
    }
  }
  return polygon.plane;
};

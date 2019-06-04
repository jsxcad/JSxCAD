import { fromPoints } from '@jsxcad/math-plane';

export const toPlane = (polygon) => {
  if (polygon.plane === undefined) {
    if (polygon.length >= 3) {
      // FIX: Find a better way to handle polygons with colinear points.
      for (let nth = 0; nth < polygon.length - 2; nth++) {
        polygon.plane = fromPoints(polygon[nth], polygon[nth + 1], polygon[nth + 2]);
        if (!isNaN(polygon.plane[0])) break;
      }
    } else {
      throw Error('die');
    }
  }
  return polygon.plane;
};

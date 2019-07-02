import { fromPolygon } from '@jsxcad/math-plane';

export const toPlane = (polygon) => {
  if (polygon.plane === undefined) {
    polygon.plane = fromPolygon(polygon);
  }
  return polygon.plane;
};

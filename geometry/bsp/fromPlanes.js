import { fromPolygons } from './bsp.js';
import { toPolygon } from '@jsxcad/math-plane';

export const fromPlanes = (planes, normalize) => {
  const polygons = [];
  for (const plane of planes) {
    polygons.push(toPolygon(plane));
  }
  return fromPolygons(polygons, normalize);
};

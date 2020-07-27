import { fromPolygons } from './bsp.js';
import { toPolygon as toPolygonFromPlane } from '@jsxcad/math-plane';

export const fromPlanes = (planes, normalize) => {
  const polygons = [];
  for (const plane of planes) {
    polygons.push(toPolygonFromPlane(plane));
  }
  return fromPolygons(polygons, normalize);
};

import { getOcct } from './occt.js';

export const toPolygons = (shape) => {
  const outputJson = getOcct().toPolygons(shape);
  const polygons = JSON.parse(outputJson);
  return polygons;
};

import { getOcct } from './occt.js';

export const fromPolygons = (polygons) => {
  const inputJson = JSON.stringify(polygons);
  const shape = getOcct().fromPolygons(inputJson);
  return shape;
};

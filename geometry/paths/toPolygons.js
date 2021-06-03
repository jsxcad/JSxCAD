import { map } from './map.js';
import { toPolygon } from '../geometry-path';

export const toPolygons = (paths) => {
  if (paths.isPolygons !== true) {
    paths = map(paths, toPolygon);
    paths.isPolygons = true;
  }
  return paths;
};

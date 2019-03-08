import { map } from './map';
import { toPolygon } from '@jsxcad/algorithm-path';

export const toPolygons = (paths) => {
  if (paths.isPolygons !== true) {
    paths = map(paths, toPolygon);
    paths.isPolygons = true;
  }
  return paths;
};

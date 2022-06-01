import {
  deletePendingSurfaceMeshes,
  fromPolygons as fromPolygonsWithCgal,
} from '@jsxcad/algorithm-cgal';

import { taggedGroup } from './tagged/taggedGroup.js';

export const fromPolygons = (options, polygons) => {
  const outputs = fromPolygonsWithCgal(polygons);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs);
};

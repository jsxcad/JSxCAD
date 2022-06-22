import {
  deletePendingSurfaceMeshes,
  fromPolygons as fromPolygonsWithCgal,
} from '@jsxcad/algorithm-cgal';

import { taggedGroup } from './tagged/taggedGroup.js';

export const fromPolygons = (
  polygons,
  { tags = [], close = false, tolerance = 0.001 } = {}
) => {
  const outputs = fromPolygonsWithCgal(polygons, close, tolerance);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};

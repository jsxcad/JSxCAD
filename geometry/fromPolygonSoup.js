import {
  deletePendingSurfaceMeshes,
  fromPolygonSoup as fromPolygonSoupWithCgal,
} from '@jsxcad/algorithm-cgal';

import { taggedGroup } from './tagged/taggedGroup.js';

export const fromPolygonSoup = (
  polygons,
  { tags = [], close = false, tolerance = 0.001 } = {}
) => {
  const outputs = fromPolygonSoupWithCgal(polygons, close, tolerance);
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs.map((output) => ({ ...output, tags })));
};
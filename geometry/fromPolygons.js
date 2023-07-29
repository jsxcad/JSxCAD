import { Group } from './Group.js';
import { fromPolygons as fromPolygonsWithCgal } from '@jsxcad/algorithm-cgal';

export const fromPolygons = (
  polygons,
  { tags = [], close = false, tolerance = 0.001 } = {}
) => {
  const outputs = fromPolygonsWithCgal(polygons, close, tolerance);
  return Group(outputs.map((output) => ({ ...output, tags })));
};

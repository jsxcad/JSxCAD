import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { toPolygons as toPolygonsFromSurface } from '@jsxcad/geometry-surface';

export const toPolygons = (options = {}, solid) => {
  const normalize = createNormalize3();
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...toPolygonsFromSurface({}, surface));
  }
  return polygons;
};

import { toPolygons as toPolygonsFromSurface } from '@jsxcad/geometry-surface';

import { assertGood } from './assertGood';

// Relax the coplanar arrangement into polygon soup.
export const toPolygons = (options = {}, solid) => {
  assertGood(solid);
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...toPolygonsFromSurface({}, surface));
  }
  return polygons;
};

import { add, scale } from '@jsxcad/math-vec3';
import {
  outline as outlineSurface,
  toPlane as toPlaneFromSurface,
} from '@jsxcad/geometry-surface';

import { fromPolygons } from './bsp.js';
import { getEdges } from '@jsxcad/geometry-path';

const LARGE = 1e10;

export const fromSurface = (surface, normalize) => {
  const polygons = [];
  const normal = toPlaneFromSurface(surface);
  if (normal === undefined) {
    // The surface is degenerate.
    return fromPolygons([]);
  }
  const top = scale(LARGE, normal);
  const bottom = scale(-LARGE, normal);
  for (const path of outlineSurface(surface, normalize)) {
    for (const [start, end] of getEdges(path)) {
      // Build a large wall.
      polygons.push([
        add(start, top),
        add(start, bottom),
        add(end, bottom),
        add(end, top),
      ]);
    }
  }
  // This is an excessively large uncapped prism.
  return fromPolygons(polygons, normalize);
};

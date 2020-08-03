import { add, scale } from '@jsxcad/math-vec3';
import {
  flip as flipSurface,
  toPlane as toPlaneFromSurface,
  translate as translateSurface,
} from '@jsxcad/geometry-surface';

import { fromPolygons } from './bsp.js';
import { getEdges } from '@jsxcad/geometry-path';
import { outlineSurface } from '@jsxcad/geometry-halfedge';

const LARGE = 1e10;

export const fromSurface = (surface, normalize) => {
  const polygons = [];
  const normal = toPlaneFromSurface(surface);
  if (normal !== undefined) {
    const top = scale(LARGE, normal);
    const bottom = scale(0, normal);
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
    // Build a tall prism.
    polygons.push(...translateSurface(bottom, flipSurface(surface)));
    polygons.push(...translateSurface(top, surface));
  }
  return fromPolygons(polygons, normalize);
};
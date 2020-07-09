import { add, scale } from '@jsxcad/math-vec3';
import {
  outline as outlineSurface,
  toPlane as toPlaneFromSurface,
} from '@jsxcad/geometry-surface';

import { getEdges } from '@jsxcad/geometry-path';

const large = 1e10;

export const fromSurface = (surface, normalize) => {
  const walls = [];
  const normal = toPlaneFromSurface(surface);
  const top = scale(large, normal);
  const bottom = scale(-large, normal);
  for (const path of outlineSurface(surface, normalize)) {
    for (const [start, end] of getEdges(path)) {
      // Build a large wall.
      walls.push([
        add(start, top),
        add(start, bottom),
        add(end, bottom),
        add(end, top),
      ]);
    }
  }
  // This is an excessively large uncapped prism.
  return [walls];
};

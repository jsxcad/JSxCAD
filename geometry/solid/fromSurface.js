import { add, scale } from '@jsxcad/math-vec3';
import {
  flip as flipSurface,
  outline as outlineSurface,
  toPlane as toPlaneFromSurface,
  translate as translateSurface,
} from '@jsxcad/geometry-surface';

import { getEdges } from '@jsxcad/geometry-path';

// const LARGE = 1e10;
const LARGE = 1;

export const fromSurface = (surface, normalize) => {
  const solid = [];
  const normal = toPlaneFromSurface(surface);
  if (normal === undefined) {
    // The surface is degenerate.
    return [];
  }
  const top = scale(LARGE, normal);
  const bottom = scale(0, normal);
  for (const path of outlineSurface(surface, normalize)) {
    for (const [start, end] of getEdges(path)) {
      // Build a large wall.
      solid.push([
        [add(start, top), add(start, bottom), add(end, bottom), add(end, top)],
      ]);
    }
  }
  // Build a tall prism.
  solid.push(
    translateSurface(bottom, flipSurface(surface)),
    translateSurface(top, surface)
  );
  return solid;
};

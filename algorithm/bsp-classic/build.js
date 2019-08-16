import { measureArea, toPlane } from '@jsxcad/geometry-surface';

import { create } from './create';
import { splitSurface } from './splitSurface';

// Build a BSP tree out of surfaces. When called on an existing tree, the
// new surfaces are filtered down to the bottom of the tree and become new
// nodes there. Each set of surfaces is partitioned using the surface with the largest area.
export const build = (bsp, surfaces) => {
  if (surfaces.length === 0) {
    return;
  }
  if (bsp.plane === undefined) {
    let largestSurface = surfaces[0];
    for (let nth = 1; nth < surfaces.length; nth++) {
      if (measureArea(surfaces[nth]) > measureArea(largestSurface)) {
        largestSurface = surfaces[nth];
      }
    }
    // Use the plane of the surface to partition the branches.
    bsp.plane = toPlane(largestSurface);
  }
  let front = [];
  let back = [];
  for (let i = 0; i < surfaces.length; i++) {
    splitSurface(bsp.plane, bsp.surfaces, bsp.surfaces, front, back, surfaces[i]);
  }
  if (front.length > 0) {
    if (bsp.front === undefined) {
      bsp.front = create();
    }
    build(bsp.front, front);
  }
  if (back.length > 0) {
    if (bsp.back === undefined) {
      bsp.back = create();
    }
    build(bsp.back, back);
  }
};

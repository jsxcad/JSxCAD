import { create } from './create';
import { splitSurface } from './splitSurface';
import { toPlane } from '@jsxcad/geometry-surface';

// A convex BSP tree is always arbitrarily degenerate.
export const buildConvex = (bsp, surfaces) => {
  while (bsp.back !== undefined) {
    bsp = bsp.back;
  }

  for (const surface of surfaces) {
    if (bsp.plane !== undefined) {
      bsp.back = create();
      bsp = bsp.back;
    }
    bsp.plane = toPlane(surface);
    bsp.surfaces.push(surface);
  }
};

export const build = (bsp, surfaces) => {
  buildTree(bsp, surfaces);
};

// Build a BSP tree out of surfaces. When called on an existing tree, the
// new surfaces are filtered down to the bottom of the tree and become new
// nodes there. Each set of surfaces is partitioned using the surface with the largest area.
export const buildTree = (bsp, surfaces) => {
  if (surfaces.length === 0) {
    return;
  }
  if (bsp.plane === undefined) {
    bsp.plane = toPlane(surfaces[0]);
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
    buildTree(bsp.front, front);
  }
  if (back.length > 0) {
    if (bsp.back === undefined) {
      bsp.back = create();
    }
    buildTree(bsp.back, back);
  }
};

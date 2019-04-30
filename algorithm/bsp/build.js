import { create } from './create';
import { splitPolygon } from './splitPolygon';
import { toPlane } from '@jsxcad/math-poly3';

// Build a BSP tree out of `polygons`. When called on an existing tree, the
// new polygons are filtered down to the bottom of the tree and become new
// nodes there. Each set of polygons is partitioned using the first polygon
// (no heuristic is used to pick a good split).
export const build = (bsp, polygons) => {
  if (polygons.length === 0) {
    return;
  }
  if (bsp.plane === undefined) {
    // Use the first polygon to partition the branches.
    bsp.plane = toPlane(polygons[0]);
  }
  let front = [];
  let back = [];
  for (let i = 0; i < polygons.length; i++) {
    splitPolygon(bsp.plane, bsp.polygons, bsp.polygons, front, back, polygons[i]);
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

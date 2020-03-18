import { makeConvex, measureArea, retessellate } from '@jsxcad/geometry-surface';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { createNormalize4 } from './createNormalize4';
import { intersection } from '@jsxcad/geometry-surface-boolean';
import { isClockwise } from '@jsxcad/geometry-path';
// import { makeWatertight } from './makeWatertight';
import { toPlane } from '@jsxcad/math-poly3';

export let doCheckOverlap = false;
export let doDefragment = 'default';

const clockOrder = (a) => isClockwise(a) ? 1 : 0;

// Reorder in-place such that counterclockwise paths preceed clockwise paths.
const clockSort = (surface) => {
  surface.sort((a, b) => clockOrder(a) - clockOrder(b));
  return surface;
};

export const fromPolygons = (options = {}, polygons, normalize3 = createNormalize3()) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    if (polygon.length < 3) {
      // Polygon became degenerate.
      continue;
    }
    const plane = toPlane(polygon);
    if (plane === undefined) {
      // Polygon is degenerate -- probably on a line.
      continue;
    }
    // Here we use a strict plane identity to merge.
    // This may result in fragmentation.
    // const key = JSON.stringify(toPlane(polygon));
    const key = normalize4(toPlane(polygon));
    const groups = coplanarGroups.get(key);
    if (groups === undefined) {
      const group = [polygon];
      group.plane = key;
      coplanarGroups.set(key, group);
    } else {
      groups.push(polygon);
    }
  }

  // The solid is a list of surfaces, which are lists of coplanar polygons.
  const defragmented = [];

  // Erase substructure and make convex.
  for (const polygons of coplanarGroups.values()) {
    clockSort(polygons);
    if (doCheckOverlap) {
      for (const a of polygons) {
        for (const b of polygons) {
          if (a === b) continue;
          const overlap = intersection([a], [b]);
          if (overlap.length > 0) {
            const area = measureArea(overlap);
            if (area > 1) {
              console.log(`QQ/overlap/area: ${area}`);
              throw Error('die: overlap');
            }
          }
        }
      }
    }
    let surface;
    switch (doDefragment) {
      default:
        surface = polygons;
        break;
      case 'makeConvex':
        surface = makeConvex(polygons, normalize3, toPlane(polygons[0]));
        break;
      case 'retessellate':
        surface = retessellate(polygons, normalize3, toPlane(polygons[0]));
        break;
    }
    defragmented.push(surface);
  }

  return defragmented;
  // return makeWatertight(defragmented, normalize3);
};

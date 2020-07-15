import { cleanSolid } from '@jsxcad/geometry-halfedge';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { createNormalize4 } from './createNormalize4.js';
import { makeWatertight } from './makeWatertight.js';
import { toPlane } from '@jsxcad/math-poly3';

export let doCheckOverlap = false;
export let doDefragment = 'none';

export const fromPolygons = (
  polygons,
  normalize3 = createNormalize3()
) => {
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
  const solid = [];
  for (const surface of coplanarGroups.values()) {
    solid.push(surface);
  }
  const watertightSolid = makeWatertight(solid, normalize3);
  const cleanedSolid = cleanSolid(watertightSolid, normalize3);
  return cleanedSolid;
};

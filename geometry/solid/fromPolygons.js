import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { createNormalize4 } from './createNormalize4';
import { makeConvex } from '@jsxcad/geometry-surface';
import { makeWatertight } from './makeWatertight';
import { toPlane } from '@jsxcad/math-poly3';

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
      // console.log(`QQ/fromPolygons/degenerate`);
      continue;
    }
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
  for (const [plane, polygons] of coplanarGroups) {
    const surface = makeConvex(polygons, normalize3, plane);
    defragmented.push(surface);
  }

  return makeWatertight(defragmented);
};

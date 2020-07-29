import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSolidToCleanSolid } from '@jsxcad/geometry-halfedge';
import { makeWatertight } from './makeWatertight.js';

export let doCheckOverlap = false;
export let doDefragment = 'none';

/** @type {function(Polygon[],Normalizer):Solid} */
export const fromPolygons = (polygons, normalize3 = createNormalize3()) => {
  /*
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
*/
  const watertightSolid = makeWatertight([polygons], normalize3);
  const cleanedSolid = fromSolidToCleanSolid(watertightSolid, normalize3);
  return cleanedSolid;
};

import { alignVertices } from './alignVertices';
import { createNormalize4 } from './createNormalize4';
import { fromPolygons as fromPolygonsToSurface } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';

export const fromPolygons = (options = {}, polygons) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    if (polygon.length < 3) {
      // Polygon became degenerate.
      continue;
    }
    const plane = toPlane(polygon);
    if (plane === undefined) {
      console.log(`QQ/fromPolygons/degenerate`);
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
  const solid = [];

  for (const [plane, polygons] of coplanarGroups) {
    if (polygons.length === 1) {
      // A single polygon forms a valid surface.
      solid.push(polygons);
    } else {
      const surface = fromPolygonsToSurface({ plane }, polygons);
      solid.push(surface);
    }
  }

  const alignedSolid = alignVertices(solid);
  return alignedSolid;
};

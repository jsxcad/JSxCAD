import { createNormalize3 } from './createNormalize3';
import { createNormalize4 } from './createNormalize4';
import { deduplicate } from '@jsxcad/geometry-path';
import { assertGood, fromPolygons as fromPolygonsToSurface } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';

export const fromPolygons = (options = {}, polygons) => {
  assertGood(polygons);
  const normalize4 = createNormalize4();
  const normalize3 = createNormalize3();
  const coplanarGroups = new Map();

  for (const basePolygon of polygons) {
    const polygon = deduplicate(basePolygon.map(normalize3));
    if (polygon.length < 3) {
      // Polygon became degenerate.
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
    assertGood(polygons);
    if (polygons.length === 1) {
      // A single polygon forms a valid surface.
      solid.push(polygons);
    } else {
      const surface = fromPolygonsToSurface({ plane }, polygons);
      assertGood(surface);
      solid.push(surface);
    }
  }

  if (polygons.isConvex === true) {
    solid.isConvex = true;
  }

  return solid;
};

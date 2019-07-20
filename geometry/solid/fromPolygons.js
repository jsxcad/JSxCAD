import { canonicalize, clean, fromPolygons as fromPolygonsToSurface, union } from '@jsxcad/geometry-surface';
import { createNormalize4 } from './createNormalize4';
import { toPlane } from '@jsxcad/math-poly3';

const deduplicate = (polygons) => {
  const map = new Map();
  for (const polygon of polygons) {
    const key = JSON.stringify(polygon);
    if (!map.has(key)) {
      map.set(key, polygon);
    }
  }
  return [...map.values()];
}

export const fromPolygons = (options = {}, polygons) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    const key = normalize4(toPlane(polygon));
    const groups = coplanarGroups.get(key);
    if (groups === undefined) {
      coplanarGroups.set(key, [polygon]);
    } else {
      groups.push(polygon);
    }
  }

  // The solid is a list of surfaces, which are lists of coplanar polygons.
  const solid = [];

  for (const polygons of coplanarGroups.values()) {
    if (polygons.length === 1) {
      // A single polygon forms a valid surface.
      solid.push(polygons);
    } else if (true) {
      const surface = fromPolygonsToSurface(polygons);
      console.log(`QQ/polygons: ${JSON.stringify(canonicalize(polygons))}`);
      console.log(`QQ/surface: ${JSON.stringify(canonicalize(surface))}`);
      solid.push(surface);
    } else {
      const pick = Math.floor(Math.random() * polygons.length);
      solid.push([polygons[pick]]);
    }
  }

  if (polygons.isConvex === true) {
    solid.isConvex = true;
  }
  return solid;
};

import { alignVertices } from './alignVertices';
import { createNormalize3 } from './createNormalize3';
import { createNormalize4 } from './createNormalize4';
import { deduplicate } from '@jsxcad/geometry-path';
import { fromPolygons as fromPolygonsToSurface } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';

const assertWellConnected = (rawPolygons) => {
  return;
  if (rawPolygons.length < 2) { return; }
  const normalize3 = createNormalize3();
  const polygons = rawPolygons.map(polygon => polygon.map(normalize3));
  const vertices = new Map();
  for (const polygon of polygons) {
    for (const vertex of polygon) {
      if (!vertices.has(vertex)) {
        vertices.set(vertex, [polygon]);
      } else {
        vertices.get(vertex).push(polygon);
      }
    }
  }
  const seen = new Set();
  const walk = (polygon) => {
    if (seen.has(polygon)) { return; }
    seen.add(polygon)
    // Let's assume that a shared vertex implies a shared edge.
    for (const vertex of polygon) {
      for (const neighbour of vertices.get(vertex)) {
        walk(neighbour);
      }
    }
  }
  walk(polygons[0]);
  for (const polygon of polygons) {
    if (!seen.has(polygon)) {
      throw Error('die');
    }
  }
}

export const fromPolygons = (options = {}, polygons) => {
  const normalize4 = createNormalize4();
  const coplanarGroups = new Map();

  const normalize3 = createNormalize3();

  for (const polygon of polygons) {
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
    if (false) {
      solid.push(polygons);
    } else {
      if (polygons.length === 1) {
        // A single polygon forms a valid surface.
        solid.push(polygons);
      } else {
        const surface = fromPolygonsToSurface({ plane }, polygons);
        if (surface.length > 1) {
          console.log(`QQ/not defragmented`);
          const surface2 = fromPolygonsToSurface({ plane }, polygons);
          console.log(`QQ/${JSON.stringify(surface2)}`);
        }
        solid.push(surface);
      }
    }
  }

  const alignedSolid = alignVertices(solid);
  return alignedSolid;
};

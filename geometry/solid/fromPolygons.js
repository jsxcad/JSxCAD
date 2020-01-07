import { alignVertices } from './alignVertices';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { createNormalize4 } from './createNormalize4';
import { fromPolygons as fromPolygonsToSurface } from '@jsxcad/geometry-surface';
import { getEdges } from '@jsxcad/geometry-path';
import { toPlane } from '@jsxcad/math-poly3';

const X = 0;
const Y = 1;
const Z = 2;

export const fromPolygons = (options = {}, rawPolygons) => {
  const normalize4 = createNormalize4();
  const normalize3 = createNormalize3();
  const coplanarGroups = new Map();

  const polygons = [];

  for (const polygon of rawPolygons) {
    if (polygon.length < 3) {
      continue;
    } else if (polygon.length === 3) {
      polygons.push(polygon.map(normalize3));
    } else {
      // The polygon is convex.
      // Triangulate with the center to accommodate plane popping.
      const center = [0, 0, 0];
      for (const point of polygon) {
        center[X] += point[X];
        center[Y] += point[Y];
        center[Z] += point[Z];
      }
      center[X] /= polygon.length;
      center[Y] /= polygon.length;
      center[Z] /= polygon.length;
      for (const [start, end] of getEdges(polygon)) {
        polygons.push([start, end, center].map(normalize3));
      }
    }
  }

  for (const polygon of polygons) {
    const plane = toPlane(polygon);
    if (plane === undefined) {
      console.log(`QQ/fromPolygons/degenerate`);
      continue;
    }
    // const key = normalize4(toPlane(polygon));
    const key = JSON.stringify(toPlane(polygon));
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

  const alignedSolid = alignVertices(solid, normalize3);
  return alignedSolid;
};

import { assertGood, deduplicate } from '@jsxcad/geometry-path';

import { flip as flipSurface, makeConvex } from '@jsxcad/geometry-surface';

import { fromPolygon as toPlaneFromPolygon } from '@jsxcad/math-plane';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    const a = deduplicate([floor[start], floor[end], roof[start]]);
    const b = deduplicate([floor[end], roof[end], roof[start]]);

    // Some of these polygons may become degenerate -- skip those.
    if (toPlaneFromPolygon(a)) {
      polygons.push(a);
    }

    if (toPlaneFromPolygon(b)) {
      polygons.push(b);
    }
  }
};

// Build a tube from generated path slices.
// The paths are assumed to connect in a 1:1 vertical relationship before deduplication.
export const buildFromSlices = (buildPath, resolution, cap = true) => {
  const polygons = [];
  const step = 1 / resolution;
  let lastPath;
  for (let t = 0; t <= 1; t += step) {
    const path = buildPath(t);
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      if (cap) {
        const deduplicatedPath = deduplicate(path);
        if (deduplicatedPath.length > 0) {
          polygons.push(...makeConvex([deduplicatedPath]));
        }
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    const deduplicatedPath = deduplicate(lastPath);
    if (deduplicatedPath.length > 0) {
      polygons.push(...flipSurface(makeConvex([deduplicatedPath])));
    }
  }

  return { solid: toSolidFromPolygons({}, flipSurface(polygons)) };
};

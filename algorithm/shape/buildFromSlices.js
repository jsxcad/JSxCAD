import { assertGood, deduplicate } from '@jsxcad/geometry-path';

import { flip as flipPolygons } from '@jsxcad/geometry-polygons';
import { makeConvex } from '@jsxcad/geometry-surface';
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
  for (let slice = 0; slice <= 1; slice += step) {
    const path = buildPath(slice);
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      if (cap) {
        polygons.push(...makeConvex({}, [deduplicate(path)]));
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    polygons.push(...flipPolygons(makeConvex({}, [deduplicate(lastPath)])));
  }

  return { solid: toSolidFromPolygons({}, flipPolygons(polygons)) };
};

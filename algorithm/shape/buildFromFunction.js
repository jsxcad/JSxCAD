import { assertGood, deduplicate, flip as flipPath } from '@jsxcad/geometry-path';

import { flip as flipPolygons } from '@jsxcad/geometry-polygons';

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    polygons.push(deduplicate([floor[start], floor[end], roof[start]]));
    polygons.push(deduplicate([floor[end], roof[end], roof[start]]));
  }
};

const buildPath = (op, context, slice, resolution) => {
  const points = [];
  for (let p = 0; p <= 1; p += 1 / resolution) {
    points.push(op(context, slice, p));
  }
  return points;
};

// Build a tube from generated path slices.
// The paths are assumed to connect in a 1:1 vertical relationship before deduplication.
export const buildFromFunction = (op, context, resolution, cap = true) => {
  const polygons = [];
  const step = 1 / resolution;
  let lastPath;
  for (let slice = 0; slice <= 1; slice += step) {
    const path = buildPath(op, context, slice, resolution);
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      if (cap) {
        polygons.push(path);
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    polygons.push(flipPath(lastPath));
  }
  return flipPolygons(polygons);
};

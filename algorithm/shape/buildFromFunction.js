import { assertGood, deduplicate, flip as flipPath } from '@jsxcad/geometry-path';

import { cache } from '@jsxcad/cache';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

const EPSILON = 1e-5;

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    polygons.push(deduplicate([floor[start], floor[end], roof[start]]));
    polygons.push(deduplicate([floor[end], roof[end], roof[start]]));
  }
};

const buildPath = (op, latitude, resolution, context) => {
  const points = [];
  const step = 1 / resolution;
  for (let longitude = 0; longitude <= 1; longitude += step) {
    points.push(op(latitude, longitude, context));
  }
  return points;
};

// Build a tube from generated path slices.
// The paths are assumed to connect in a 1:1 vertical relationship before deduplication.
const buildFromFunctionImpl = (op, resolution, cap = true, context) => {
  const polygons = [];
  const step = 1 / resolution;
  let lastPath;
  for (let latitude = 0; latitude <= 1 + EPSILON; latitude += step) {
    const path = buildPath(op, latitude, resolution, context);
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      if (cap) {
        polygons.push(deduplicate(path));
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    polygons.push(deduplicate(flipPath(lastPath)));
  }
  const solid = { solid: toSolidFromPolygons({}, polygons) };
  return solid;
};

export const buildFromFunction = cache(buildFromFunctionImpl);

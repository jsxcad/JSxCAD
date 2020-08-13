import {
  assertGood,
  deduplicate,
  flip,
  scale,
  translate,
} from '@jsxcad/geometry-path';

import { buildRegularPolygon } from './buildRegularPolygon.js';
import { cache } from '@jsxcad/cache';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

const buildWalls = (polygons, floor, roof) => {
  for (
    let start = floor.length - 1, end = 0;
    end < floor.length;
    start = end++
  ) {
    // Remember that we are walking CCW.
    polygons.push(
      deduplicate([floor[start], floor[end], roof[end], roof[start]])
    );
  }
};

// Approximates a UV sphere.
const buildRingSphereImpl = (resolution = 20) => {
  /** @type {Polygon[]} */
  const polygons = [];
  let lastPath;

  const latitudinalResolution = 2 + resolution;
  const longitudinalResolution = 2 * latitudinalResolution;

  // Trace out latitudinal rings.
  const ring = buildRegularPolygon(longitudinalResolution);
  let path;
  const getEffectiveSlice = (slice) => {
    if (slice === 0) {
      return 0.5;
    } else if (slice === latitudinalResolution) {
      return latitudinalResolution - 0.5;
    } else {
      return slice;
    }
  };
  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    const angle =
      (Math.PI * 1.0 * getEffectiveSlice(slice)) / latitudinalResolution;
    const height = Math.cos(angle);
    const radius = Math.sin(angle);
    const points = ring;
    const scaledPath = scale([radius, radius, radius], points);
    const translatedPath = translate([0, 0, height], scaledPath);
    path = translatedPath;
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      polygons.push(path);
    }
    lastPath = path;
  }
  if (path) {
    polygons.push(flip(path));
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  return fromPolygonsToSolid(polygons);
};

export const buildRingSphere = cache(buildRingSphereImpl);

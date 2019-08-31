import { assertGood, deduplicate, scale, translate } from '@jsxcad/geometry-path';

import { buildRegularPolygon } from './buildRegularPolygon';

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    polygons.push(deduplicate([floor[start], floor[end], roof[end], roof[start]]));
  }
};

// Approximates a UV sphere.
export const buildRingSphere = ({ resolution = 20 }) => {
  const polygons = [];
  let lastPath;

  const latitudinalResolution = 2 + resolution;
  const longitudinalResolution = 2 * latitudinalResolution;

  // Trace out latitudinal rings.
  const ring = buildRegularPolygon(longitudinalResolution);
  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    let angle = Math.PI * 1.0 * slice / latitudinalResolution;
    let height = Math.cos(angle);
    let radius = Math.sin(angle);
    const path = translate([0, 0, height], scale([radius, radius, radius], ring));
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    }
    lastPath = path;
  }
  polygons.isConvex = true;
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  return polygons;
};

import { scale, translate } from '@jsxcad/geometry-path';

import { buildRegularPolygon } from './buildRegularPolygon';

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    polygons.push([floor[start], floor[end], roof[end], roof[start]]);
  }
};

export const buildRingSphere = ({ resolution = 20 }) => {
  const polygons = [];
  let lastPath;
  // Trace out latitudinal rings.
  const ring = buildRegularPolygon({ edges: resolution });
  for (let slice = 0; slice <= resolution; slice++) {
    let angle = Math.PI * 1.0 * slice / resolution;
    let height = Math.cos(angle);
    let radius = Math.sin(angle);
    const path = translate([0, 0, height], scale([radius, radius, radius], ring));
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    }
    lastPath = path;
  }
  polygons.isConvex = true;
  return polygons;
};

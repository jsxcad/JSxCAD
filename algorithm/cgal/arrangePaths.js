import { close, isClosed } from '@jsxcad/geometry-path';

import { getCgal } from './getCgal.js';

export const arrangePaths = (x, y, z, w, paths) => {
  const c = getCgal();
  let nth = 0;
  let target;
  let polygon;
  let polygons = [];
  c.ArrangePaths(
    x,
    y,
    z,
    w,
    (points) => {
      const path = paths[nth++];
      if (path) {
        for (const [x, y, z] of close(path)) {
          c.addPoint(points, x, y, z);
        }
        if (isClosed(path)) {
          // Close the path with the starting point.
          for (const [x, y, z] of path) {
            c.addPoint(points, x, y, z);
            break;
          }
        }
      }
    },
    (isHole) => {
      if (isHole) {
        target = [];
        polygon.holes.push(target);
      } else {
        target = [];
        polygon = { points: target, holes: [] };
        polygons.push(polygon);
      }
    },
    (x, y, z) => {
      target.push([x, y, z]);
    }
  );
  return polygons;
};

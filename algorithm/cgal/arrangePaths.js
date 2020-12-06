import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';
import { getEdges } from '@jsxcad/geometry-path';

const X = 0;
const Y = 1;
const Z = 2;

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
        for (const [start, end] of getEdges(path)) {
          if (equals(start, end)) {
            continue;
          }
          c.addPoint(points, start[X], start[Y], start[Z]);
          c.addPoint(points, end[X], end[Y], end[Z]);
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

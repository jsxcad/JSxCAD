import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';
import { getEdges } from '@jsxcad/geometry-path';

const X = 0;
const Y = 1;
const Z = 2;

export const arrangePaths = (plane, exactPlane, paths, triangulate = false) => {
  const c = getCgal();
  let nth = 0;
  let target;
  let polygon;
  let polygons = [];
  const fill = (points) => {
    const path = paths[nth++];
    if (path) {
      if (path === undefined || path.points === undefined) {
        Error.stackTraceLimit = Infinity;
        throw Error(`die: ${JSON.stringify(path)}`);
      }
      for (const [start, end] of getEdges(path.points)) {
        if (equals(start, end)) {
          continue;
        }
        c.addPoint(points, start[X], start[Y], start[Z]);
        c.addPoint(points, end[X], end[Y], end[Z]);
      }
    }
  };
  const emitPolygon = (isHole) => {
    if (isHole) {
      target = { points: [], exactPoints: [], holes: [], plane, exactPlane };
      polygon.holes.push(target);
    } else {
      polygon = { points: [], exactPoints: [], holes: [], plane, exactPlane };
      polygons.push(polygon);
      target = polygon;
    }
  };
  const emitPoint = (x, y, z, exactX, exactY, exactZ) => {
    target.points.push([x, y, z]);
    target.exactPoints.push([exactX, exactY, exactZ]);
  };
  if (exactPlane) {
    const [x, y, z, w] = exactPlane;
    c.ArrangePathsExact(x, y, z, w, triangulate, fill, emitPolygon, emitPoint);
  } else {
    const [x, y, z, w] = plane;
    c.ArrangePathsApproximate(
      x,
      y,
      z,
      w,
      triangulate,
      fill,
      emitPolygon,
      emitPoint
    );
  }
  return polygons;
};

export const arrangePathsIntoTriangles = (plane, exactPlane, paths) =>
  arrangePaths(plane, exactPlane, paths, /* triangulate= */ true);

import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

export const getPathEdges = (path) => {
  const edges = [];
  let last = null;
  for (const point of path) {
    if (point === null) {
      continue;
    }
    if (last !== null) {
      edges.push([last, point]);
    }
    last = point;
  }
  if (path[0] !== null) {
    edges.push([last, path[0]]);
  }
  return edges;
};

const X = 0;
const Y = 1;
const Z = 2;

export const arrangePaths = (
  plane,
  exactPlane,
  inputPolygons,
  triangulate = false
) => {
  throw Error('die');
  try {
    const c = getCgal();
    let nth = 0;
    let target;
    let polygon;
    let polygons = [];
    const fill = (out) => {
      if (nth < inputPolygons.length) {
        const { exactPoints, points } = inputPolygons[nth++];
        if (exactPoints) {
          for (const [start, end] of getPathEdges(exactPoints)) {
            if (equals(start, end)) {
              continue;
            }
            c.addExactPoint(out, start[X], start[Y], start[Z]);
            c.addExactPoint(out, end[X], end[Y], end[Z]);
          }
        } else if (points) {
          for (const [start, end] of getPathEdges(points)) {
            if (equals(start, end)) {
              continue;
            }
            c.addPoint(out, start[X], start[Y], start[Z]);
            c.addPoint(out, end[X], end[Y], end[Z]);
          }
        }
      }
    };
    const emitPolygon = (isHole) => {
      target = { points: [], exactPoints: [], holes: [], plane, exactPlane };
      if (isHole) {
        polygon.holes.push(target);
      } else {
        polygons.push(target);
        polygon = target;
      }
    };
    const emitPoint = (x, y, z, exactX, exactY, exactZ) => {
      target.points.push([x, y, z]);
      target.exactPoints.push([exactX, exactY, exactZ]);
    };
    if (exactPlane) {
      const [x, y, z, w] = exactPlane;
      c.ArrangePathsExact(
        x,
        y,
        z,
        w,
        triangulate,
        fill,
        emitPolygon,
        emitPoint
      );
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
  } catch (error) {
    throw Error(error);
  }
};

export const arrangePathsIntoTriangles = (plane, exactPlane, polygons) =>
  arrangePaths(plane, exactPlane, polygons, /* triangulate= */ true);

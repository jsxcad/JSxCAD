import { getCgal } from './getCgal.js';

const X = 0;
const Y = 1;
const Z = 2;

export const arrangeSegments = (
  plane,
  exactPlane,
  segments,
  triangulate = false
) => {
  const c = getCgal();
  let target;
  let polygon;
  let polygons = [];
  const fill = (out) => {
    for (const [start, end] of segments) {
      c.addPoint(out, start[X], start[Y], start[Z]);
      c.addPoint(out, end[X], end[Y], end[Z]);
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

export const arrangeSegmentsIntoTriangles = (plane, exactPlane, polygons) =>
  arrangeSegments(plane, exactPlane, polygons, /* triangulate= */ true);

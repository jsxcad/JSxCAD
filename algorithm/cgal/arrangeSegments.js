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
  try {
    const c = getCgal();
    let target;
    let polygon;
    let polygons = [];
    let filled = false;
    const fill = (out) => {
      // This interface is a bit silly.
      if (!filled) {
        for (const [start, end] of segments) {
          c.addPoint(out, start[X], start[Y], start[Z]);
          c.addPoint(out, end[X], end[Y], end[Z]);
        }
        filled = true;
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
      const [x, y, z, w] = plane || [0, 0, 1, 0];
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

export const arrangeSegmentsIntoTriangles = (plane, exactPlane, polygons) =>
  arrangeSegments(plane, exactPlane, polygons, /* triangulate= */ true);

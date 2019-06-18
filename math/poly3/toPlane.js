import { dot, length, scale } from '@jsxcad/math-vec3';

import { fromPoints } from '@jsxcad/math-plane';

export const toPlaneForConvexPolygon = (polygon) => {
  if (polygon.plane === undefined) {
    if (polygon.length >= 3) {
      // FIX: Find a better way to handle polygons with colinear points.
      // FIX: Inferring a plane from a corner only works reliably for convex polygons.
      for (let nth = 0; nth < polygon.length - 2; nth++) {
        polygon.plane = fromPoints(polygon[nth], polygon[nth + 1], polygon[nth + 2]);
        if (!isNaN(polygon.plane[0])) break;
      }
    } else {
      throw Error('die');
    }
  }
  return polygon.plane;
};

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// Newell's method for computing the plane of a polygon.
export const toPlane = (polygon) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  let lastPoint = polygon[polygon.length - 1];
  for (const thisPoint of polygon) {
    normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
    normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
    normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
    reference[X] += lastPoint[X];
    reference[Y] += lastPoint[Y];
    reference[Z] += lastPoint[Z];
    lastPoint = thisPoint;
  }
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / polygon.length;
  return plane;
};

import { dot, length, scale } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// Newell's method for computing the plane of a polygon.
export const fromPolygon = (polygon) => {
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
  if (isNaN(plane[0])) {
    return undefined;
  } else {
    return plane;
  }
};

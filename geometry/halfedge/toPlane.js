import { dot, length, scale } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

// Newell's method for computing the plane of a polygon.
export const toPlane = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let last = start;
  let size = 0;
  for (let edge = start.next; edge !== start; last = edge, edge = edge.next) {
    const lastPoint = last.start;
    const thisPoint = edge.start;
    normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
    normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
    normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
    reference[X] += lastPoint[X];
    reference[Y] += lastPoint[Y];
    reference[Z] += lastPoint[Z];
    size += 1;
  }
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / size;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

export default toPlane;

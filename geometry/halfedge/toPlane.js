/**
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").Plane} Plane
 */

import { dot, length, scale } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

/**
 * toPlane
 *
 * @function
 * @param {Edge} loop
 * @param {boolean} recompute
 * @returns {Plane}
 */
export const toPlane = (loop, recompute = false) => {
  if (loop.face.plane === undefined || recompute) {
    loop.face.plane = toPlaneFromLoop(loop.face);
  }
  return loop.face.plane;
};

/**
 * Newell's method for computing the plane of a polygon.
 *
 * @function
 * @param {Edge} start
 * @returns {Plane}
 */
export const toPlaneFromLoop = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let size = 0;
  let link = start;
  do {
    const lastPoint = link.start;
    const thisPoint = link.next.start;
    if (lastPoint !== thisPoint) {
      normal[X] +=
        (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
      normal[Y] +=
        (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
      normal[Z] +=
        (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
      reference[X] += lastPoint[X];
      reference[Y] += lastPoint[Y];
      reference[Z] += lastPoint[Z];
      size += 1;
    }
    link = link.next;
  } while (link !== start);
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = (dot(reference, normal) * factor) / size;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

export default toPlane;

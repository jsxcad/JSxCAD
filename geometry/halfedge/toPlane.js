import { dot, length, scale } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

export const toPlane = (loop, verbose = false) => {
  if (loop.face.plane === undefined || verbose) {
    loop.face.plane = toPlaneFromLoop(loop.face, verbose);
  }
  return loop.face.plane;
}

// Newell's method for computing the plane of a polygon.
export const toPlaneFromLoop = (start, verbose = false) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let size = 0;
  let link = start;
  do {
if (verbose) console.log(`QQ/XXX: ${link.start}`);
    const lastPoint = link.start;
    const thisPoint = link.next.start;
    if (lastPoint !== thisPoint) {
if (verbose) console.log(`QQ/toPlaneFromLoop: ${lastPoint} -> ${thisPoint}`);
      normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
      normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
      normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
if (verbose) console.log(`QQ/normal: ${normal}`);
      reference[X] += lastPoint[X];
      reference[Y] += lastPoint[Y];
      reference[Z] += lastPoint[Z];
      size += 1;
    }
    link = link.next;
  } while (link !== start);
  if (verbose) console.log(`QQ/toPlaneFromLoop/normal: ${normal}`);
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

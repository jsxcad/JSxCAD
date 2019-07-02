import { measureBoundingSphere, toPlane } from '@jsxcad/geometry-surface';

import { cut } from './cut';
import { signedDistanceToPoint as planeDistance } from '@jsxcad/math-plane';

const CONSERVATIVE_EPSILON = 1e-4;
const THRESHOLD = 64;

export const measureDistance = (plane, surface) => {
  // Try to classify the whole surface first.
  const [sphereCenter, sphereRadius] = measureBoundingSphere(surface);
  const sphereDistance = planeDistance(plane, sphereCenter);

  if (sphereDistance - sphereRadius > CONSERVATIVE_EPSILON) {
    return sphereDistance - sphereRadius;
  }

  if (sphereDistance + sphereRadius < -CONSERVATIVE_EPSILON) {
    return sphereDistance + sphereRadius;
  }

  return 0;
};

export const measureDivisionDistance = (surfaces) => {
  const plane = toPlane(surfaces[0]);
  const distances = [];
  let front = 0;
  let back = 0;
  for (let nth = 1; nth < surfaces.length; nth++) {
    const surface = surfaces[nth];
    const distance = measureDistance(plane, surface);
    if (distance > 0) {
      front += 1;
    } else if (distance < 0) {
      back += 1;
    }
    distances.push(distance);
  }

  // See if it is degenerate.
  if (front === 0) {
  // console.log(`QQ/distances/front: degenerate`);
    // Cut the back in half.
    distances.sort();
    // console.log(`QQ/distances/sorted: ${distances}`);
    for (let probe = 0, median = 0; probe < distances.length; probe += 2, median += 1) {
      // console.log(`QQ/probe/index: ${probe}`);
      // console.log(`QQ/probe/distance: ${distances[probe]}`);
      if (distances[probe] >= 0) {
        return distances[median];
      }
    }
  } else if (back === 0) {
  // console.log(`QQ/distances/back: degenerate`);
    // Cut the front in half.
    distances.sort().reverse();
    for (let probe = 0, median = 0; probe < distances.length; probe += 2, median += 1) {
      if (distances[probe] <= 0) {
        return distances[median];
      }
    }
  }

  // Nothing to do.
  return 0;
};

export const divide = (solid) => {
  const parts = [];
  subdivide(parts, solid);
  return parts;
};

export const subdivide = (parts, solid) => {
// console.log(`QQ/subdivide`);
  if (solid.length < THRESHOLD) {
    // console.log(`QQ/subdivide/threshold: below`);
    // Below some threshold degeneracy is cheaper than the fix.
    parts.push(solid);
  } else {
    const divisionDistance = measureDivisionDistance(solid);
    // console.log(`QQ/subdivide/divisionDistance: ${divisionDistance}`);

    if (divisionDistance !== 0) {
      // console.log(`QQ/subdivide/divisionDistance: not-zero`);
      const [x, y, z, w] = toPlane(solid[0]);
      const divisionPlane = [x, y, z, w + divisionDistance];
      const [front, back] = cut(divisionPlane, solid);
      subdivide(parts, front);
      subdivide(parts, back);
    } else {
      // console.log(`QQ/subdivide/divisionDistance: zero`);
      parts.push(solid);
    }
  }
};

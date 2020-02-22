import { equals as planeEquals, splitLineSegmentByPlane } from '@jsxcad/math-plane';

import { squaredDistance } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;
const EPSILON2 = 1e-10;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

//  dot(plane, point) - plane[W];
export const planeDistance = (plane, point) =>
  plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];

// const toType = (plane, point) => {
//   // const t = planeDistance(plane, point);
//   const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
//   if (t < -EPSILON) {
//     return BACK;
//   } else if (t > EPSILON) {
//     return FRONT;
//   } else {
//     return COPLANAR;
//   }
// };

const pointType = [];

const splitPolygon = (normalize, plane, polygon, back, abutting, overlapping, front) => {
  /*
    // This slows things down on average, probably due to not having the bounding sphere computed.
    // Check for non-intersection due to distance from the plane.
    const [center, radius] = measureBoundingSphere(polygon);
    let distance = planeDistance(plane, center) + EPSILON;
    if (distance > radius) {
      front.push(polygon);
      return;
    } else if (distance < -radius) {
      back.push(polygon);
      return;
    }
  */
  let polygonType = COPLANAR;
  const polygonPlane = toPlane(polygon);
  if (polygonPlane === undefined) {
    // Degenerate polygon
    return;
  }
  if (!planeEquals(polygonPlane, plane)) {
    for (let nth = 0; nth < polygon.length; nth++) {
      // const type = toType(plane, polygon[nth]);
      // const t = planeDistance(plane, point);
      const point = polygon[nth];
      const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
      if (t < -EPSILON) {
        polygonType |= BACK;
        pointType[nth] = BACK;
      } else if (t > EPSILON) {
        polygonType |= FRONT;
        pointType[nth] = FRONT;
      } else {
        polygonType |= COPLANAR;
        pointType[nth] = COPLANAR;
      }
    }
  }

  // Put the polygon in the correct list, splitting it when necessary.
  switch (polygonType) {
    case COPLANAR:
      if (dot(plane, polygonPlane) > 0) {
        // The plane and the polygon face the same way, so the spaces overlap.
        overlapping.push(polygon);
      } else {
        // The plane and the polygon face the opposite directions, so the spaces abut.
        abutting.push(polygon);
      }
      return;
    case FRONT:
      front.push(polygon);
      return;
    case BACK:
      back.push(polygon);
      return;
    case SPANNING: {
      const frontPoints = [];
      let lastFront;
      const backPoints = [];
      let lastBack;
      const last = polygon.length - 1;
      let startPoint = polygon[last];
      let startType = pointType[last];
      for (let nth = 0; nth < polygon.length; nth++) {
        const endPoint = polygon[nth];
        const endType = pointType[nth];
        if (startType !== BACK) {
          // The inequality is important as it includes COPLANAR points.
          if (lastFront === undefined || squaredDistance(startPoint, lastFront) > EPSILON2) {
            lastFront = startPoint;
            frontPoints.push(startPoint);
          }
        }
        if (startType !== FRONT) {
          // The inequality is important as it includes COPLANAR points.
          if (lastBack === undefined || squaredDistance(startPoint, lastBack) > EPSILON2) {
            lastBack = startPoint;
            backPoints.push(startPoint);
          }
        }
        if ((startType | endType) === SPANNING) {
          // This should exclude COPLANAR points.
          // Compute the point that touches the splitting plane.
          // const spanPoint = splitLineSegmentByPlane(plane, ...[startPoint, endPoint].sort());
          const spanPoint = splitLineSegmentByPlane(plane, startPoint, endPoint);
          if (lastFront === undefined || squaredDistance(spanPoint, lastFront) > EPSILON2) {
            lastFront = spanPoint;
            frontPoints.push(spanPoint);
          }
          if (lastBack === undefined || squaredDistance(spanPoint, lastBack) > EPSILON2) {
            lastBack = spanPoint;
            backPoints.push(spanPoint);
          }
        }
        startPoint = endPoint;
        startType = endType;
      }
      if (frontPoints.length >= 3) {
        while (squaredDistance(frontPoints[0], lastFront) <= EPSILON2) {
          frontPoints.pop();
          lastFront = frontPoints[frontPoints.length - 1];
        }
      }
      if (frontPoints.length >= 3) {
        frontPoints.plane = polygonPlane;
        if (backPoints.length >= 3) {
          frontPoints.parent = polygon;
          frontPoints.sibling = backPoints;
        }
        front.push(frontPoints);
      }
      if (backPoints.length >= 3) {
        while (squaredDistance(backPoints[0], lastBack) <= EPSILON2) {
          backPoints.pop();
          lastBack = backPoints[backPoints.length - 1];
        }
      }
      if (backPoints.length >= 3) {
        backPoints.plane = polygonPlane;
        if (frontPoints.length >= 3) {
          backPoints.parent = polygon;
          backPoints.sibling = frontPoints;
        }
        back.push(backPoints);
      }
      break;
    }
  }
};

export {
  BACK,
  COPLANAR_BACK,
  COPLANAR_FRONT,
  EPSILON,
  FRONT,
  splitPolygon
};

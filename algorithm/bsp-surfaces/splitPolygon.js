import { equals as planeEquals, splitLineSegmentByPlane } from '@jsxcad/math-plane';

import { squaredDistance } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;
const THRESHOLD2 = 1e-10;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const COPLANAR_FRONT = 4;
const COPLANAR_BACK = 5;

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

//  dot(plane, point) - plane[W];
export const planeDistance = (plane, point) => plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];

const toType = (plane, point) => {
  // const t = planeDistance(plane, point);
  const t = plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];
  if (t < -EPSILON) {
    return BACK;
  } else if (t > EPSILON) {
    return FRONT;
  } else {
    return COPLANAR;
  }
};

const pointType = [];

export const splitPolygon = (plane, polygon, emit) => {
  const last = polygon.length - 1;
  pointType.length = 0;
  let polygonType = COPLANAR;
  if (!planeEquals(toPlane(polygon), plane)) {
    for (const point of polygon) {
      const type = toType(plane, point);
      polygonType |= type;
      pointType.push(type);
    }
  }

  // Put the polygon in the correct list, splitting it when necessary.
  switch (polygonType) {
    case COPLANAR:
      if (dot(plane, toPlane(polygon)) > 0) {
        emit(polygon, COPLANAR_FRONT);
      } else {
        emit(polygon, COPLANAR_BACK);
      }
      break;
    case FRONT:
      emit(polygon, FRONT);
      break;
    case BACK:
      emit(polygon, BACK);
      break;
    case SPANNING: {
      let frontPoints = [];
      let backPoints = [];
      let startPoint = polygon[last];
      let startType = pointType[last];
      for (let nth = 0; nth < polygon.length; nth++) {
        const endPoint = polygon[nth];
        const endType = pointType[nth];
        if (startType !== BACK) {
          // The inequality is important as it includes COPLANAR points.
          frontPoints.push(startPoint);
        }
        if (startType !== FRONT) {
          // The inequality is important as it includes COPLANAR points.
          backPoints.push(startPoint);
        }
        if ((startType | endType) === SPANNING) {
          // This should exclude COPLANAR points.
          // Compute the point that touches the splitting plane.
          const spanPoint = splitLineSegmentByPlane(plane, ...[startPoint, endPoint].sort());
          if (squaredDistance(spanPoint, startPoint) > THRESHOLD2) {
            frontPoints.push(spanPoint);
          }
          if (squaredDistance(spanPoint, endPoint) > THRESHOLD2) {
            backPoints.push(spanPoint);
          }
        }
        startPoint = endPoint;
        startType = endType;
      }
      if (frontPoints.length >= 3) {
        emit(frontPoints, FRONT);
      }
      if (backPoints.length >= 3) {
        emit(backPoints, BACK);
      }
      break;
    }
  }
};

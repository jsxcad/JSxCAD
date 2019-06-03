import { dot, scale, subtract } from '@jsxcad/math-vec3';
import { signedDistanceToPoint as planeDistance, equals as planeEquals, splitLineSegmentByPlane } from '@jsxcad/math-plane';

import { assertCoplanar } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const toType = (plane, point) => {
  let t = planeDistance(plane, point);
  if (t < -EPSILON) {
    return BACK;
  } else if (t > EPSILON) {
    return FRONT;
  } else {
    return COPLANAR;
  }
};

const pointType = [];

export const splitSurface = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, surface) => {
  // assertCoplanar(surface);
  let coplanarFrontPolygons;
  let coplanarBackPolygons;
  let frontPolygons;
  let backPolygons;
  for (const polygon of surface) {
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
      case COPLANAR: {
        if (dot(plane, toPlane(polygon)) > 0) {
          if (coplanarFrontPolygons === undefined) {
            coplanarFrontPolygons = [];
          }
          coplanarFrontPolygons.push(polygon);
        } else {
          if (coplanarBackPolygons === undefined) {
            coplanarBackPolygons = [];
          }
          coplanarBackPolygons.push(polygon);
        }
        break;
      }
      case FRONT: {
        if (frontPolygons === undefined) {
          frontPolygons = [];
        }
        frontPolygons.push(polygon);
        break;
      }
      case BACK: {
        if (backPolygons === undefined) {
          backPolygons = [];
        }
        backPolygons.push(polygon);
        break;
      }
      case SPANNING: {
        let frontPoints = [];
        let backPoints = [];
        let startPoint = polygon[polygon.length - 1];
        let startType = pointType[polygon.length - 1];
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
            const rawSpanPoint = splitLineSegmentByPlane(plane, startPoint, endPoint);
            const spanPoint = subtract(rawSpanPoint, scale(planeDistance(toPlane(polygon), rawSpanPoint), plane));
            frontPoints.push(spanPoint);
            backPoints.push(spanPoint);
            if (Math.abs(planeDistance(plane, spanPoint)) > EPSILON) throw Error('die');
            if (frontPoints.length >= 3) {
              assertCoplanar([frontPoints]);
            }
            if (backPoints.length >= 3) {
              assertCoplanar([backPoints]);
            }
          }
          startPoint = endPoint;
          startType = endType;
        }
        if (frontPoints.length >= 3) {
        // Add the polygon that sticks out the front of the plane.
          if (frontPolygons === undefined) {
            frontPolygons = [];
          }
          frontPolygons.push(frontPoints);
        } else {
          // throw Error('die');
        }
        if (backPoints.length >= 3) {
        // Add the polygon that sticks out the back of the plane.
          if (backPolygons === undefined) {
            backPolygons = [];
          }
          backPolygons.push(backPoints);
        } else {
          // throw Error('die');
        }
        break;
      }
    }
  }
  if (coplanarFrontPolygons !== undefined) {
    // assertCoplanar(coplanarFrontPolygons);
    coplanarFrontSurfaces.push(coplanarFrontPolygons);
  }
  if (coplanarBackPolygons !== undefined) {
    // assertCoplanar(coplanarBackPolygons);
    coplanarBackSurfaces.push(coplanarBackPolygons);
  }
  if (frontPolygons !== undefined) {
    // assertCoplanar(frontPolygons);
    frontSurfaces.push(frontPolygons);
  }
  if (backPolygons !== undefined) {
    // assertCoplanar(backPolygons);
    backSurfaces.push(backPolygons);
  }
};

export const splitSurfaceOld = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, surface) => {
  assertCoplanar(surface);
  const coplanarFrontPolygons = [];
  const coplanarBackPolygons = [];
  const frontPolygons = [];
  const backPolygons = [];
  let polygonType = COPLANAR;
  for (const polygon of surface) {
    if (!planeEquals(toPlane(polygon), plane)) {
      for (const point of polygon) {
        polygonType |= toType(plane, point);
      }
    }

    // Put the polygon in the correct list, splitting it when necessary.
    switch (polygonType) {
      case COPLANAR: {
        if (dot(plane, toPlane(polygon)) > 0) {
          coplanarFrontPolygons.push(polygon);
        } else {
          coplanarBackPolygons.push(polygon);
        }
        break;
      }
      case FRONT: {
        frontPolygons.push(polygon);
        break;
      }
      case BACK: {
        backPolygons.push(polygon);
        break;
      }
      case SPANNING: {
        let frontPoints = [];
        let backPoints = [];
        let startPoint = polygon[polygon.length - 1];
        let startType = toType(plane, startPoint);
        for (const endPoint of polygon) {
          const endType = toType(plane, endPoint);
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
            const rawSpanPoint = splitLineSegmentByPlane(plane, startPoint, endPoint);
            const spanPoint = subtract(rawSpanPoint, scale(planeDistance(toPlane(polygon), rawSpanPoint), plane));
            frontPoints.push(spanPoint);
            backPoints.push(spanPoint);
            if (Math.abs(planeDistance(plane, spanPoint)) > EPSILON) throw Error('die');
            if (frontPoints.length >= 3) {
              assertCoplanar([frontPoints]);
            }
            if (backPoints.length >= 3) {
              assertCoplanar([backPoints]);
            }
          }
          startPoint = endPoint;
          startType = endType;
        }
        if (frontPoints.length >= 3) {
        // Add the polygon that sticks out the front of the plane.
          frontPolygons.push(frontPoints);
        } else {
          // throw Error('die');
        }
        if (backPoints.length >= 3) {
        // Add the polygon that sticks out the back of the plane.
          backPolygons.push(backPoints);
        } else {
          // throw Error('die');
        }
        break;
      }
    }
  }
  if (coplanarFrontPolygons.length > 0) {
    assertCoplanar(coplanarFrontPolygons);
    coplanarFrontSurfaces.push(coplanarFrontPolygons);
  }
  if (coplanarBackPolygons.length > 0) {
    assertCoplanar(coplanarBackPolygons);
    coplanarBackSurfaces.push(coplanarBackPolygons);
  }
  if (frontPolygons.length > 0) {
    assertCoplanar(frontPolygons);
    frontSurfaces.push(frontPolygons);
  }
  if (backPolygons.length > 0) {
    assertCoplanar(backPolygons);
    backSurfaces.push(backPolygons);
  }
};

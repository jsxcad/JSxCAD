import { dot as dot2, squaredDistance } from '@jsxcad/math-vec3';
import { signedDistanceToPoint as planeDistance2, equals as planeEquals, splitLineSegmentByPlane } from '@jsxcad/math-plane';
import { measureBoundingSphere } from '@jsxcad/geometry-surface';

import { toPlane } from '@jsxcad/math-poly3';

const CONSERVATIVE_EPSILON = 1e-4;
const EPSILON = 1e-5;
const THRESHOLD2 = 1e-10;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

//  dot(plane, point) - plane[W];
export const planeDistance = (plane, point) => plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] - plane[3];

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

let splitSurfaceCount = 0;
let splitSurfaceMark = 1;

export const splitSurface = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, surface) => {
  if (++splitSurfaceCount >= splitSurfaceMark) {
    splitSurfaceMark *= 1.2;
    // console.log(`QQ/splitSurfaceCount: ${splitSurfaceCount}`);
  }

  // Try to classify the whole surface first.
  const [sphereCenter, sphereRadius] = measureBoundingSphere(surface);
  const sphereDistance = planeDistance(plane, sphereCenter);

  if (sphereDistance - sphereRadius > CONSERVATIVE_EPSILON) {
    frontSurfaces.push(surface);
    return;
  }

  if (sphereDistance + sphereRadius < -CONSERVATIVE_EPSILON) {
    backSurfaces.push(surface);
    return;
  }

  // Consider the polygons within the surface.
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
    coplanarFrontSurfaces.push(coplanarFrontPolygons);
  }
  if (coplanarBackPolygons !== undefined) {
    coplanarBackSurfaces.push(coplanarBackPolygons);
  }
  if (frontPolygons !== undefined) {
    frontSurfaces.push(frontPolygons);
  }
  if (backPolygons !== undefined) {
    backSurfaces.push(backPolygons);
  }
};

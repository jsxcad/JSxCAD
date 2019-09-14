import { dot, scale, subtract } from '@jsxcad/math-vec3';
import { signedDistanceToPoint as planeDistance, equals as planeEquals, splitLineSegmentByPlane } from '@jsxcad/math-plane';

import { cacheCut } from '@jsxcad/cache';
import { toPlane } from './toPlane';

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

export const cutSurface = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, frontEdges, backEdges, surface) => {
  const surfacePlane = toPlane(surface);
  if (surfacePlane === undefined) {
    // Degenerate.
    return;
  }
  let coplanarFrontPolygons;
  let coplanarBackPolygons;
  let frontPolygons;
  let backPolygons;
  for (let polygon of surface) {
    pointType.length = 0;
    let polygonType = COPLANAR;
    if (!planeEquals(surfacePlane, plane)) {
      for (const point of polygon) {
        const type = toType(plane, point);
        polygonType |= type;
        pointType.push(type);
      }
    }

    // Put the polygon in the correct list, splitting it when necessary.
    switch (polygonType) {
      case COPLANAR: {
        if (dot(plane, surfacePlane) > 0) {
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
        let startPoint = polygon[polygon.length - 1];
        let startType = pointType[polygon.length - 1];
        for (let nth = 0; nth < polygon.length; nth++) {
          const endPoint = polygon[nth];
          const endType = pointType[nth];
          if (startType === COPLANAR && endType === COPLANAR) {
            frontEdges.push([startPoint, endPoint]);
          }
          startPoint = endPoint;
          startType = endType;
        }
        break;
      }
      case BACK: {
        if (backPolygons === undefined) {
          backPolygons = [];
        }
        backPolygons.push(polygon);
        let startPoint = polygon[polygon.length - 1];
        let startType = pointType[polygon.length - 1];
        for (let nth = 0; nth < polygon.length; nth++) {
          const endPoint = polygon[nth];
          const endType = pointType[nth];
          if (startType === COPLANAR && endType === COPLANAR) {
            backEdges.push([startPoint, endPoint]);
          }
          startPoint = endPoint;
          startType = endType;
        }
        break;
      }
      case SPANNING: {
        // Make a local copy so that mutation does not propagate.
        polygon = polygon.slice();
        let backPoints = [];
        let frontPoints = [];
        // Add the colinear spanning point to the polygon.
        {
          let last = polygon.length - 1;
          for (let current = 0; current < polygon.length; last = current++) {
            const lastType = pointType[last];
            const lastPoint = polygon[last];
            if ((lastType | pointType[current]) === SPANNING) {
              // Break spanning segments at the point of intersection.
              const rawSpanPoint = splitLineSegmentByPlane(plane, lastPoint, polygon[current]);
              const spanPoint = subtract(rawSpanPoint, scale(planeDistance(surfacePlane, rawSpanPoint), plane));
              // Note: Destructive modification of polygon here.
              polygon.splice(current, 0, spanPoint);
              pointType.splice(current, 0, COPLANAR);
            }
          }
        }
        // Spanning points have been inserted.
        {
          let last = polygon.length - 1;
          let lastCoplanar = polygon[pointType.lastIndexOf(COPLANAR)];
          for (let current = 0; current < polygon.length; last = current++) {
            const point = polygon[current];
            const type = pointType[current];
            const lastType = pointType[last];
            const lastPoint = polygon[last];
            if (type !== FRONT) {
              backPoints.push(point);
            }
            if (type !== BACK) {
              frontPoints.push(point);
            }
            if (type === COPLANAR) {
              if (lastType === COPLANAR) {
                frontEdges.push([lastPoint, point]);
                backEdges.push([lastPoint, point]);
              } else if (lastType === BACK) {
                frontEdges.push([lastCoplanar, point]);
              } else if (lastType === FRONT) {
                backEdges.push([lastCoplanar, point]);
              }
              lastCoplanar = point;
            }
          }
        }
        if (frontPoints.length >= 3) {
        // Add the polygon that sticks out the front of the plane.
          if (frontPolygons === undefined) {
            frontPolygons = [];
          }
          frontPolygons.push(frontPoints);
        }
        if (backPoints.length >= 3) {
        // Add the polygon that sticks out the back of the plane.
          if (backPolygons === undefined) {
            backPolygons = [];
          }
          backPolygons.push(backPoints);
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

const cutImpl = (plane, surface) => {
  const front = [];
  const back = [];
  const frontEdges = [];
  const backEdges = [];

  cutSurface(plane, front, back, front, back, frontEdges, backEdges, surface);
  if (frontEdges.some(edge => edge[1] === undefined)) {
    throw Error(`die/end/missing: ${JSON.stringify(frontEdges)}`);
  }

  return [[].concat(...front), [].concat(...back)];
};

export const cut = cacheCut(cutImpl);

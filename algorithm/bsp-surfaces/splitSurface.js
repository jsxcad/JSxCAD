import { dot, lerp, squaredDistance, subtract } from '@jsxcad/math-vec3';
import { toPlane } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;
const EPSILON_SQUARED = Math.pow(EPSILON, 2);

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const W = 3;

const toType = (plane, point) => {
  let t = dot(plane, point) - plane[W];
  if (t < -EPSILON) {
    return BACK;
  } else if (t > EPSILON) {
    return FRONT;
  } else {
    return COPLANAR;
  }
};

export const splitSurface = (plane, coplanarFrontSurfaces, coplanarBackSurfaces, frontSurfaces, backSurfaces, surface) => {
  const coplanarFrontPolygons = [];
  const coplanarBackPolygons = [];
  const frontPolygons = [];
  const backPolygons = [];
  for (const polygon of surface) {
    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let polygonType = 0;
    for (const point of polygon) {
      polygonType |= toType(plane, point);
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
            let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
            // Canonicalization of the point would violate coplanarity in some cases.
            // We could work around this by triangulation, but that doubles the load.
            // Actually, even with triangulation, this can twist planes sufficiently that the splitting
            // invariant is violated, leading to infinite recursion.
            // So we defer canonicalization, and deal with degenerate triangles upon later canonicalization.
            const spanPoint = lerp(t, startPoint, endPoint);
            if (squaredDistance(spanPoint, startPoint) >= EPSILON_SQUARED &&
                squaredDistance(spanPoint, endPoint) >= EPSILON_SQUARED) {
              // Minimize the production of degenerate polygons.
              frontPoints.push(spanPoint);
              backPoints.push(spanPoint);
            }
          }
          startPoint = endPoint;
          startType = endType;
        }
        if (frontPoints.length >= 3) {
        // Add the polygon that sticks out the front of the plane.
          frontPolygons.push(frontPoints);
        } else {
          throw Error('die');
        }
        if (backPoints.length >= 3) {
        // Add the polygon that sticks out the back of the plane.
          backPolygons.push(backPoints);
        } else {
          throw Error('die');
        }
        break;
      }
    }
  }
  if (coplanarFrontPolygons.length > 0) {
    coplanarFrontSurfaces.push(coplanarFrontPolygons);
  }
  if (coplanarBackPolygons.length > 0) {
    coplanarBackSurfaces.push(coplanarBackPolygons);
  }
  if (frontPolygons.length > 0) {
    frontSurfaces.push(frontPolygons);
  }
  if (backPolygons.length > 0) {
    backSurfaces.push(backPolygons);
  }
};

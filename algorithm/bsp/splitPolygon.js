import { toPlane } from '@jsxcad/math-poly3';
import { canonicalize, dot, equals, lerp, subtract } from '@jsxcad/math-vec3';
import { isDegenerate, isTriangle } from '@jsxcad/algorithm-triangles';
import { measureArea, } from '@jsxcad/math-poly3';

const EPSILON = 1e-5;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const W = 3;

export const splitPolygon = (plane, coplanarFront, coplanarBack, front, back, polygon) => {
  // Classify each point as well as the entire polygon into one of the above
  // four classes.
  let polygonType = 0;
  let types = polygon.map(point => {
    let t = dot(plane, point) - plane[W];
    let type = (t < -EPSILON) ? BACK
      : (t > EPSILON) ? FRONT
        : COPLANAR;
    polygonType |= type;
    return type;
  });

  // Put the polygon in the correct list, splitting it when necessary.
  switch (polygonType) {
    case COPLANAR: {
      if (dot(plane, toPlane(polygon)) > 0) {
        coplanarFront.push(polygon);
      } else {
        coplanarBack.push(polygon);
      }
      break;
    }
    case FRONT: {
      front.push(polygon);
      break;
    }
    case BACK: {
      back.push(polygon);
      break;
    }
    case SPANNING: {
      let frontPoints = [];
      let backPoints = [];
      for (let start = 0; start < polygon.length; start++) {
        let end = (start + 1) % polygon.length;
        // For each edge, i~j.
        let startType = types[start];
        let endType = types[end];
        let startPoint = polygon[start];
        let endPoint = polygon[end];
        if (startType !== BACK) {
          frontPoints.push(startPoint);
        }
        if (startType !== FRONT) {
          backPoints.push(startPoint);
        }
        if ((startType | endType) === SPANNING) {
        // Compute the point that touches the splitting plane.
          let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
          let spanPoint = lerp(t, startPoint, endPoint);
          frontPoints.push(spanPoint);
          backPoints.push(spanPoint);
        }
      }
      if (frontPoints.length >= 3) {
      // Add the polygon that sticks out the front of the plane.
        if (!isDegenerate(frontPoints)) {
          front.push(frontPoints);
        }
      }
      if (backPoints.length >= 3) {
      // Add the polygon that sticks out the back of the plane.
        if (!isDegenerate(backPoints)) {
          back.push(backPoints);
        }
      }
      break;
    }
  }
};

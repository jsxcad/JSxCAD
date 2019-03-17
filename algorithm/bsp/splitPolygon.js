import { toPlane } from '@jsxcad/math-poly3';
import { dot, lerp, subtract } from '@jsxcad/math-vec3';

const EPSILON = 1e-5;

const COPLANAR = 0; // Neither front nor back.
const FRONT = 1;
const BACK = 2;
const SPANNING = 3; // Both front and back.

const W = 3;

const toType = (plane, point) => {
  let t = dot(plane, point) - plane[W];
  let type = (t < -EPSILON) ? BACK
    : (t > EPSILON) ? FRONT
      : COPLANAR;
  return type;
}

export const splitPolygon = (plane, coplanarFront, coplanarBack, front, back, polygon, expectCoplanar) => {
  // Classify each point as well as the entire polygon into one of the above
  // four classes.
  let polygonType = 0;
  for (const point of polygon) {
    polygonType |= toType(plane, point);
  }

  if (expectCoplanar === true && polygonType !== COPLANAR) {
    console.log(`QQ/splitPolygon/polygon: ${JSON.stringify(polygon)}`);
    console.log(`QQ/splitPolygon/polygon/plane: ${JSON.stringify(toPlane(polygon))}`);
    console.log(`QQ/splitPolygon/split/plane: ${JSON.stringify(plane)}`);
    throw Error('die');
  }

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
      let startPoint = polygon[polygon.length - 1];
      let startType = toType(plane, startPoint);
      for (const endPoint of polygon) {
        const endType = toType(plane, endPoint);
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
        startPoint = endPoint;
        startType = endType;
      }
      if (frontPoints.length >= 3) {
      // Add the polygon that sticks out the front of the plane.
        front.push(frontPoints);
      } else if (frontPoints.length == 4) {
        front.push([frontPoints[0], frontPoints[1], frontPoints[3]]);
        front.push([frontPoints[3], frontPoints[1], frontPoints[2]]);
      } else throw Error('die');
      if (backPoints.length >= 3) {
      // Add the polygon that sticks out the back of the plane.
        back.push(backPoints);
      } else if (backPoints.length == 4) {
        back.push([backPoints[0], backPoints[1], backPoints[3]]);
        back.push([backPoints[3], backPoints[1], backPoints[2]]);
      } else throw Error('die');
      break;
    }
  }
};

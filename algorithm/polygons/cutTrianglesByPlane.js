import { canonicalize } from './canonicalize';
import { dot, lerp, subtract } from '@jsxcad/math-vec3';
import { edgesToPolygons } from './edgesToPolygons';

const EPSILON = 1e-5;

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

export const cutTrianglesByPlane = (plane, triangles) => {
  const edges = [];
  for (const triangle of triangles) {
    // Classify each point as well as the entire triangle into one of the above
    // four classes.
    let triangleType = 0;
    for (const point of triangle) {
      triangleType |= toType(plane, point);
    }

    switch (triangleType) {
      case COPLANAR: {
        // We could optimize this, but let's handle the general edge graph first.
        edges.push([triangle[0], triangle[1]],
                   [triangle[1], triangle[2]],
                   [triangle[2], triangle[0]]);
        break;
      }
      case FRONT: {
        break;
      }
      case BACK: {
        break;
      }
      case SPANNING: {
        let edgePoints = [];
        let startPoint = triangle[triangle.length - 1];
        let startType = toType(plane, startPoint);
        let spanStart = null;
        for (const endPoint of triangle) {
          const endType = toType(plane, endPoint);
          if (startType === COPLANAR && endType === COPLANAR) {
            edges.push([startPoint, endPoint]);
          } else if ((startType | endType) === SPANNING) {
            let t = (plane[W] - dot(plane, startPoint)) / dot(plane, subtract(endPoint, startPoint));
            if (spanStart !== null) {
              const spanPoint = lerp(t, startPoint, endPoint);
              if (endType === BACK) {
                // The span started on the other side, reverse the edge.
                edges.push([spanPoint, spanStart]);
              } else {
                edges.push([spanStart, spanPoint]);
              }
              spanStart = null;
            } else {
              spanStart = lerp(t, startPoint, endPoint);
            }
          }
          startPoint = endPoint;
          startType = endType;
        }
        if (spanStart !== null) {
          throw Error('die');
        }
        break;
      }
    }
  }
  return edgesToPolygons({}, canonicalize(edges));
}

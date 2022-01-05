import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

export const fromPointsToAlphaShape2AsPolygonSegments = (
  jsPoints,
  componentLimit = 0,
  alpha = 10000,
  regularized = true
) => {
  try {
    if (jsPoints.length < 3) {
      return [];
    }
    const c = getCgal();
    const segments = [];
    c.ComputeAlphaShape2AsPolygonSegments(
      componentLimit,
      alpha,
      regularized,
      (points) => {
        let addedPoints = [];
        for (const jsPoint of jsPoints) {
          if (addedPoints.some((addedPoint) => equals(addedPoint, jsPoint))) {
            continue;
          }
          addedPoints.push(jsPoint);
          const [x, y] = jsPoint;
          c.addPoint_2(points, x, y);
        }
      },
      (startX, startY, endX, endY) => {
        segments.push([
          [startX, startY],
          [endX, endY],
        ]);
      }
    );
    return segments;
  } catch (error) {
    throw Error(error);
  }
};

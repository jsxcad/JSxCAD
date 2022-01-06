import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

export const fromPointsToAlphaShapeAsSurfaceMesh = (
  jsPoints,
  componentLimit
) => {
  try {
    const c = getCgal();
    return c.ComputeAlphaShapeAsSurfaceMesh(componentLimit, (points) => {
      let addedPoints = [];
      for (const jsPoint of jsPoints) {
        if (addedPoints.some((addedPoint) => equals(addedPoint, jsPoint))) {
          continue;
        }
        addedPoints.push(jsPoint);
        const [x, y, z] = jsPoint;
        c.addPoint(points, x, y, z);
      }
    });
  } catch (error) {
    throw Error(error);
  }
};

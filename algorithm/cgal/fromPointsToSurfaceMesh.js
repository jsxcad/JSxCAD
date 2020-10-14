import { equals } from '@jsxcad/math-vec3';
import { getCgal } from './getCgal.js';

// Note: This assumes a graph without holes.
export const fromPointsToSurfaceMesh = (points) => {
  const c = getCgal();
  const addedPoints = [];
  const isAddedPoint = (point) => {
    for (const addedPoint of addedPoints) {
      if (equals(point, addedPoint)) {
        return true;
      }
      return false;
    }
  };
  return c.FromPointsToSurfaceMesh((triples) => {
    for (const point of points) {
      if (!isAddedPoint(point)) {
        addedPoints.push(point);
        const [x, y, z] = point;
        c.addTriple(triples, x, y, z);
      }
    }
  });
};

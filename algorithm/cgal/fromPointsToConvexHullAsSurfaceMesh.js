import { getCgal } from './getCgal.js';

export const fromPointsToConvexHullAsSurfaceMesh = (jsPoints) => {
  const c = getCgal();
  return c.ComputeConvexHullAsSurfaceMesh((points) => {
    for (const [x, y, z] of jsPoints) {
      c.addPoint(points, x, y, z);
    }
  });
};

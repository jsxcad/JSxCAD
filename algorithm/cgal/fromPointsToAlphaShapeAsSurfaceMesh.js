import { getCgal } from './getCgal.js';

export const fromPointsToAlphaShapeAsSurfaceMesh = (jsPoints) => {
  const c = getCgal();
  return c.ComputeAlphaShapeAsSurfaceMesh((points) => {
    for (const [x, y, z] of jsPoints) {
      c.addPoint(points, x, y, z);
    }
  });
};

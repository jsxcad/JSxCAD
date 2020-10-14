import { getCgal } from './getCgal.js';

export const fromPointsToAlphaShapeAsSurfaceMesh = (
  jsPoints,
  componentLimit
) => {
  const c = getCgal();
  return c.ComputeAlphaShapeAsSurfaceMesh(componentLimit, (points) => {
    for (const [x, y, z] of jsPoints) {
      c.addPoint(points, x, y, z);
    }
  });
};

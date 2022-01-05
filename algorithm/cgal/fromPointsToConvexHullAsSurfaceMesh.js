import { getCgal } from './getCgal.js';

export const fromPointsToConvexHullAsSurfaceMesh = (jsPoints) => {
  try {
    const c = getCgal();
    const mesh = c.ComputeConvexHullAsSurfaceMesh((points) => {
      for (const [x, y, z] of jsPoints) {
        c.addPoint(points, x, y, z);
      }
    });
    mesh.provenance = 'hull';
    return mesh;
  } catch (error) {
    throw Error(error);
  }
};

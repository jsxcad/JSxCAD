import { getCgal } from './getCgal.js';

export const pushSurfaceMesh = (
  mesh,
  force,
  minimumDistance,
  maximumDistance
) => getCgal().PushSurfaceMesh(mesh, force, minimumDistance, maximumDistance);

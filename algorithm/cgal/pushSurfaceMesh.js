import { getCgal } from './getCgal.js';

export const pushSurfaceMesh = (mesh, force, minimumDistance, scale = 1) =>
  getCgal().PushSurfaceMesh(mesh, force, minimumDistance, scale);

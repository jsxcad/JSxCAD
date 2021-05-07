import { getCgal } from './getCgal.js';

export const growSurfaceMesh = (mesh, amount) =>
  getCgal().GrowSurfaceMesh(mesh, amount);

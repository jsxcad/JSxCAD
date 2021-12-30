import { getCgal } from './getCgal.js';

export const simplifySurfaceMesh = (mesh, { stopRatio = 0.5, eps }) =>
  getCgal().SimplifySurfaceMesh(mesh, stopRatio, eps !== undefined, eps || 0);

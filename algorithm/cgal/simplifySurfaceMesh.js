import { getCgal } from './getCgal.js';

export const simplifySurfaceMesh = (mesh, resolution) =>
  getCgal().SimplifySurfaceMesh(mesh, resolution);

import { getCgal } from './getCgal.js';

export const twistSurfaceMesh = (mesh, degreesPerZ) =>
  getCgal().TwistSurfaceMesh(mesh, degreesPerZ);

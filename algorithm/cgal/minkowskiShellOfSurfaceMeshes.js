import { getCgal } from './getCgal.js';

export const minkowskiShellOfSurfaceMeshes = (mesh, offset) =>
  getCgal().MinkowskiShellOfSurfaceMeshes(mesh, offset);

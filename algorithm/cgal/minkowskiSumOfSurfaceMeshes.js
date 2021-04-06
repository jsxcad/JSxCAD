import { getCgal } from './getCgal.js';

export const minkowskiSumOfSurfaceMeshes = (mesh, offset) =>
  getCgal().MinkowskiSumOfSurfaceMeshes(mesh, offset);

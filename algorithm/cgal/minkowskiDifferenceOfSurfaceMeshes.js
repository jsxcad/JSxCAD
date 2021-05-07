import { getCgal } from './getCgal.js';

export const minkowskiDifferenceOfSurfaceMeshes = (mesh, offset) =>
  getCgal().MinkowskiDifferenceOfSurfaceMeshes(mesh, offset);

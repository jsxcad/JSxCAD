import { getCgal } from './getCgal.js';

export const reverseFaceOrientationsOfSurfaceMesh = (mesh) =>
  getCgal().ReverseFaceOrientationsOfSurfaceMesh(mesh);

import { getCgal } from './getCgal.js';

export const extrudeSurfaceMesh = (
  mesh,
  highX,
  highY,
  highZ,
  lowX,
  lowY,
  lowZ
) =>
  getCgal().ExtrusionOfSurfaceMesh(mesh, highX, highY, highZ, lowX, lowY, lowZ);

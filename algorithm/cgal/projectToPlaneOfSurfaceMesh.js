import { getCgal } from './getCgal.js';

export const projectToPlaneOfSurfaceMesh = (
  mesh,
  directionX,
  directionY,
  directionZ,
  planeX,
  planeY,
  planeZ,
  planeW
) =>
  getCgal().ProjectionToPlaneOfSurfaceMesh(
    mesh,
    directionX,
    directionY,
    directionZ,
    planeX,
    planeY,
    planeZ,
    -planeW
  );

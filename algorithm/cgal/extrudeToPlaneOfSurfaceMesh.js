import { getCgal } from './getCgal.js';

export const extrudeToPlaneOfSurfaceMesh = (
  mesh,
  highX,
  highY,
  highZ,
  highPlaneX,
  highPlaneY,
  highPlaneZ,
  highPlaneW,
  lowX,
  lowY,
  lowZ,
  lowPlaneX,
  lowPlaneY,
  lowPlaneZ,
  lowPlaneW
) =>
  getCgal().ExtrusionToPlaneOfSurfaceMesh(
    mesh,
    highX,
    highY,
    highZ,
    highPlaneX,
    highPlaneY,
    highPlaneZ,
    highPlaneW,
    lowX,
    lowY,
    lowZ,
    lowPlaneX,
    lowPlaneY,
    lowPlaneZ,
    lowPlaneW
  );

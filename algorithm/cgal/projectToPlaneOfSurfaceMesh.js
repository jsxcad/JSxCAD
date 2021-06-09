import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const projectToPlaneOfSurfaceMesh = (
  mesh,
  transform,
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
    toCgalTransformFromJsTransform(transform),
    directionX,
    directionY,
    directionZ,
    planeX,
    planeY,
    planeZ,
    -planeW
  );

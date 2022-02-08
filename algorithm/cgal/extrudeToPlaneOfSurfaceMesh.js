import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const extrudeToPlaneOfSurfaceMesh = (
  mesh,
  transform,
  enableHigh,
  highX,
  highY,
  highZ,
  highPlaneX,
  highPlaneY,
  highPlaneZ,
  highPlaneW,
  enableLow,
  lowX,
  lowY,
  lowZ,
  lowPlaneX,
  lowPlaneY,
  lowPlaneZ,
  lowPlaneW
) => {
  try {
    let extrudedMesh;
    getCgal().ExtrusionToPlaneOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      enableHigh,
      highX,
      highY,
      highZ,
      highPlaneX,
      highPlaneY,
      highPlaneZ,
      highPlaneW,
      enableLow,
      lowX,
      lowY,
      lowZ,
      lowPlaneX,
      lowPlaneY,
      lowPlaneZ,
      lowPlaneW,
      (result) => {
        extrudedMesh = result;
      }
    );
    extrudedMesh.provenance = 'extrudeToPlaneOfSurfaceMesh';
    return extrudedMesh;
  } catch (error) {
    throw Error(error);
  }
};

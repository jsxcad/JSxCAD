import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const minkowskiDifferenceOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) =>
  getCgal().MinkowskiDifferenceOfSurfaceMeshes(
    mesh,
    toCgalTransformFromJsTransform(meshTransform),
    offset,
    toCgalTransformFromJsTransform(offsetTransform)
  );

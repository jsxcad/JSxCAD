import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const minkowskiSumOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) =>
  getCgal().MinkowskiSumOfSurfaceMeshes(
    mesh,
    toCgalTransformFromJsTransform(meshTransform),
    offset,
    toCgalTransformFromJsTransform(offsetTransform)
  );

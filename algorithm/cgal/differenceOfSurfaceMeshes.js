import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const differenceOfSurfaceMeshes = (a, aTransform, b, bTransform) =>
  getCgal().DifferenceOfSurfaceMeshes(
    a,
    toCgalTransformFromJsTransform(aTransform),
    b,
    toCgalTransformFromJsTransform(bTransform)
  );

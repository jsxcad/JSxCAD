import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const intersectionOfSurfaceMeshes = (a, aTransform, b, bTransform) =>
  getCgal().IntersectionOfSurfaceMeshes(
    a,
    toCgalTransformFromJsTransform(aTransform),
    b,
    toCgalTransformFromJsTransform(bTransform),
    false, false
  );

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const unionOfSurfaceMeshes = (a, aTransform, b, bTransform) =>
  getCgal().UnionOfSurfaceMeshes(
    a,
    toCgalTransformFromJsTransform(aTransform),
    b,
    toCgalTransformFromJsTransform(bTransform)
  );

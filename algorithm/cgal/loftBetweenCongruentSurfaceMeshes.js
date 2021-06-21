import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const loftBetweenCongruentSurfaceMeshes = (
  a,
  aTransform,
  b,
  bTransform
) =>
  getCgal().LoftBetweenCongruentSurfaceMeshes(
    a,
    toCgalTransformFromJsTransform(aTransform),
    b,
    toCgalTransformFromJsTransform(bTransform)
  );

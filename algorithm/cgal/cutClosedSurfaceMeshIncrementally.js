import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutClosedSurfaceMeshIncrementally = (
  mesh,
  transform,
  check,
  cuts
) =>
  getCgal().CutClosedSurfaceMeshIncrementally(
    mesh,
    toCgalTransformFromJsTransform(transform),
    cuts.length,
    check,
    (nth) => cuts[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(cuts[nth].matrix)
  );

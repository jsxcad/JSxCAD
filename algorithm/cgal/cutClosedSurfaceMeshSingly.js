import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutClosedSurfaceMeshSingly = (mesh, transform, check, cuts) =>
  getCgal().CutClosedSurfaceMeshSingly(
    mesh,
    toCgalTransformFromJsTransform(transform),
    cuts.length,
    check,
    (nth) => cuts[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(cuts[nth].matrix)
  );

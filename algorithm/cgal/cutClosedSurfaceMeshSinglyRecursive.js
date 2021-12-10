import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutClosedSurfaceMeshSinglyRecursive = (
  mesh,
  transform,
  check,
  cuts
) =>
  getCgal().CutClosedSurfaceMeshSinglyRecursive(
    mesh,
    toCgalTransformFromJsTransform(transform),
    cuts.length,
    check,
    (nth) => cuts[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(cuts[nth].matrix)
  );

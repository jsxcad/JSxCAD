import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const growSurfaceMesh = (mesh, transform, amount) =>
  getCgal().GrowSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    amount
  );

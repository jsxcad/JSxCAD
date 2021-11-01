import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const bendSurfaceMesh = (mesh, transform, radius) =>
  getCgal().BendSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    radius
  );

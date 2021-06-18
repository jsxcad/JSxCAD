import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const bendSurfaceMesh = (mesh, transform, degreesPerMm) =>
  getCgal().BendSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    degreesPerMm
  );

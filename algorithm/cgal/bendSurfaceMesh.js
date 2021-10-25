import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const bendSurfaceMesh = (mesh, transform, turnsPerMm) =>
  getCgal().BendSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    turnsPerMm
  );

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const twistSurfaceMesh = (mesh, transform, turnsPerMm) =>
  getCgal().TwistSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    turnsPerMm
  );

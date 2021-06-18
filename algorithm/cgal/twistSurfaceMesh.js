import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const twistSurfaceMesh = (mesh, transform, degreesPerMm) =>
  getCgal().TwistSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    degreesPerMm
  );

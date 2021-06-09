import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const twistSurfaceMesh = (mesh, transform, degreesPerZ) =>
  getCgal().TwistSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform),
    degreesPerZ
  );

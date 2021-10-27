import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const SurfaceMeshQuery = (mesh, transform) => {
  const c = getCgal();
  return new c.SurfaceMeshQuery(
    mesh,
    toCgalTransformFromJsTransform(transform)
  );
};

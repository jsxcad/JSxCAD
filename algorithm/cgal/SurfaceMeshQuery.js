import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const SurfaceMeshQuery = (mesh, transform) => {
  try {
    const c = getCgal();
    return new c.SurfaceMeshQuery(
      mesh,
      toCgalTransformFromJsTransform(transform)
    );
  } catch (error) {
    throw Error(error);
  }
};

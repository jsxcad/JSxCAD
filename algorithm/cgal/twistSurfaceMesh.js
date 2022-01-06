import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const twistSurfaceMesh = (mesh, transform, turnsPerMm) => {
  try {
    return getCgal().TwistSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      turnsPerMm
    );
  } catch (error) {
    throw Error(error);
  }
};

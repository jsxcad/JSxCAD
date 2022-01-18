import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const simplifySurfaceMesh = (
  mesh,
  matrix,
  { stopRatio = 0.5, stopCount = 0, eps }
) => {
  try {
    const result = getCgal().SimplifySurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      stopRatio,
      eps !== undefined,
      eps || 0
    );
    result.provenance = 'simplify';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

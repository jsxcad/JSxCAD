import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const approximateSurfaceMesh = (
  mesh,
  matrix,
  {
    iterations = 1,
    relaxationSteps = 5,
    proxies = 0,
    minimumErrorDrop = 0.1,
    subdivisionRatio = 5.0,
    relativeToChord = false,
    withDihedralAngle = false,
    optimizeAnchorLocation = true,
    pcaPlane = false,
  }
) => {
  try {
    const result = getCgal().ApproximateSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      iterations,
      relaxationSteps,
      proxies,
      minimumErrorDrop,
      subdivisionRatio,
      relativeToChord,
      withDihedralAngle,
      optimizeAnchorLocation,
      pcaPlane
    );
    result.provenance = 'approximate';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

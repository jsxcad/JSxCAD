import { getCgal } from './getCgal.js';

export const approximateSurfaceMesh = (
  mesh,
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

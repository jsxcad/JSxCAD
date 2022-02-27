import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const loftBetweenSurfaceMeshes = (aMesh, aMatrix, bMesh, bMatrix) => {
  try {
    let result;
    getCgal().LoftBetweenSurfaceMeshes(
      aMesh,
      toCgalTransformFromJsTransform(aMatrix),
      bMesh,
      toCgalTransformFromJsTransform(bMatrix),
      (loftedMesh) => {
        result = loftedMesh;
      }
    );
    result.provenance = 'loftBetweenSurfaceMeshes';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

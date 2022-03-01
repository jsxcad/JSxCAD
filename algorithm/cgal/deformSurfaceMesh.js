import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const deformSurfaceMesh = (
  mesh,
  matrix,
  selections,
  iterations = 1000,
  tolerance = 0.0001,
  alpha = 0.02
) => {
  try {
    let result;
    getCgal().DeformSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      selections.length,
      (nth) => selections[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(selections[nth].matrix),
      (nth) => toCgalTransformFromJsTransform(selections[nth].deformation),
      iterations,
      tolerance,
      alpha,
      (deformedMesh) => {
        result = deformedMesh;
      }
    );
    if (!result) {
      throw Error('Deformation preprocessing failed');
    }
    result.provenance = 'deform';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

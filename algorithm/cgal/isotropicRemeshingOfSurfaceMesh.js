import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const isotropicRemeshingOfSurfaceMesh = (
  mesh,
  matrix,
  { iterations = 1, relaxationSteps = 1, targetEdgeLength = 1.0 },
  selections
) => {
  try {
    const remeshedMesh = getCgal().IsotropicRemeshingOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      iterations,
      relaxationSteps,
      targetEdgeLength,
      selections.length,
      (nth) => selections[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(selections[nth].matrix)
    );
    remeshedMesh.provenance = 'isotropicRemeshing';
    return remeshedMesh;
  } catch (error) {
    throw Error(error);
  }
};

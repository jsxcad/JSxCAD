import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const smoothSurfaceMesh = (
  mesh,
  matrix,
  { iterations = 1, safe = true },
  selections
) => {
  try {
    const smoothedMesh = getCgal().SmoothSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      iterations,
      safe,
      selections.length,
      (nth) => selections[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(selections[nth].matrix)
    );
    smoothedMesh.provenance = 'smooth';
    return smoothedMesh;
  } catch (error) {
    throw Error(error);
  }
};

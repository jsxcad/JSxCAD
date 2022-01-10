import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const smoothShapeOfSurfaceMesh = (
  mesh,
  matrix,
  { iterations = 1, time = 1 },
  selections
) => {
  try {
    const smoothedMesh = getCgal().SmoothShapeOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      iterations,
      time,
      selections.length,
      (nth) => selections[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(selections[nth].matrix)
    );
    smoothedMesh.provenance = 'smoothShape';
    return smoothedMesh;
  } catch (error) {
    throw Error(error);
  }
};

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const minkowskiDifferenceOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) => {
  try {
    getCgal().MinkowskiDifferenceOfSurfaceMeshes(
      mesh,
      toCgalTransformFromJsTransform(meshTransform),
      offset,
      toCgalTransformFromJsTransform(offsetTransform)
    );
  } catch (error) {
    throw Error(error);
  }
};

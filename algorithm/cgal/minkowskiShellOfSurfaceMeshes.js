import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const minkowskiShellOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) => {
  try {
    getCgal().MinkowskiShellOfSurfaceMeshes(
      mesh,
      toCgalTransformFromJsTransform(meshTransform),
      offset,
      toCgalTransformFromJsTransform(offsetTransform)
    );
  } catch (error) {
    throw Error(error);
  }
};

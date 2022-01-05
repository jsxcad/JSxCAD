import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const transformSurfaceMesh = (mesh, jsTransform) => {
  try {
    return getCgal().TransformSurfaceMeshByTransform(
      mesh,
      toCgalTransformFromJsTransform(jsTransform)
    );
  } catch (error) {
    throw Error(error);
  }
};

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const transformSurfaceMesh = (mesh, jsTransform) =>
  getCgal().TransformSurfaceMeshByTransform(
    mesh,
    toCgalTransformFromJsTransform(jsTransform)
  );

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const reverseFaceOrientationsOfSurfaceMesh = (mesh, transform) =>
  getCgal().ReverseFaceOrientationsOfSurfaceMesh(
    mesh,
    toCgalTransformFromJsTransform(transform)
  );

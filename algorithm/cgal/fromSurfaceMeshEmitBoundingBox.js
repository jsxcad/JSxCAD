import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fromSurfaceMeshEmitBoundingBox = (mesh, transform, emit) =>
  getCgal().Surface_mesh__bbox(
    mesh,
    toCgalTransformFromJsTransform(transform),
    emit
  );

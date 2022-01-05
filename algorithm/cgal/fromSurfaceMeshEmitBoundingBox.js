import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fromSurfaceMeshEmitBoundingBox = (mesh, transform, emit) => {
  try {
    return getCgal().Surface_mesh__bbox(
      mesh,
      toCgalTransformFromJsTransform(transform),
      emit
    );
  } catch (error) {
    throw Error(error);
  }
};

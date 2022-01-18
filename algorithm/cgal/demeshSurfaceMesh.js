import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const demeshSurfaceMesh = (mesh, matrix) => {
  try {
    const result = getCgal().DemeshSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix)
    );
    result.provenance = 'demesh';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

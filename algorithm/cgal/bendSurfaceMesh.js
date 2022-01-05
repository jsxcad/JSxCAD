import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const bendSurfaceMesh = (mesh, transform, radius) => {
  try {
    const bentMesh = getCgal().BendSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      radius
    );
    bentMesh.provenance = 'bend';
    return bentMesh;
  } catch (error) {
    throw Error(error);
  }
};

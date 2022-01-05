import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const fuseSurfaceMeshes = (sourceMeshes, sourceSegments) => {
  try {
    const fusedMeshes = [];
    const status = getCgal().FuseSurfaceMeshes(
      sourceMeshes.length,
      (nth) => sourceMeshes[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(sourceMeshes[nth].matrix),
      (mesh) => {
        mesh.provenance = 'fuse';
        fusedMeshes.push({ mesh });
      }
    );
    if (status === STATUS_ZERO_THICKNESS) {
      throw new ErrorZeroThickness('Zero thickness produced by fuse');
    }
    if (status !== STATUS_OK) {
      throw new Error(`Unexpected status ${status}`);
    }
    return { fusedMeshes };
  } catch (error) {
    throw Error(error);
  }
};

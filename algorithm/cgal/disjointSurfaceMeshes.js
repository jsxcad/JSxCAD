import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const disjointSurfaceMeshes = (meshes) => {
  const results = [meshes[0]];
  const status = getCgal().DisjointSurfaceMeshesIncrementally(
    meshes.length,
    (nth) => meshes[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(meshes[nth].matrix),
    (nth) => meshes[nth].tags && meshes[nth].tags.includes('type:masked'),
    (nth, mesh) => {
      const { matrix, tags } = meshes[nth];
      // Note: The 0th mesh is not emitted as it does not get cut.
      results.push({ mesh, matrix, tags });
    }
  );
  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by disjoint');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  return results;
};

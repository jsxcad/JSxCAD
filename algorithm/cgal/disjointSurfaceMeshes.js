import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { describeSurfaceMesh } from './describeSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const disjointSurfaceMeshes = (meshes, check) => {
  const results = [meshes[0]];
  console.log(`QQ/results/1: ${JSON.stringify(results)}`);
  const status = getCgal().DisjointSurfaceMeshesIncrementally(
    meshes.length,
    meshes,
    (nth) => { console.log(`QQ/mesh: ${nth} matrix ${JSON.stringify(meshes[nth].matrix)} ${JSON.stringify(describeSurfaceMesh(meshes[nth].mesh))}`); return meshes[nth].mesh; },
    (nth) => toCgalTransformFromJsTransform(meshes[nth].matrix),
    (nth) => meshes[nth].tags.includes('type:masked'),
    (nth, mesh) => {
      const { matrix, tags } = meshes[nth];
      // Note: The 0th mesh is not emitted as it does not get cut.
      results.push({ mesh, matrix, tags });
      console.log(`QQ/results/2: ${JSON.stringify(results)} matrix: ${JSON.stringify(matrix)}`);
    }
  );
  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by disjoint');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  console.log(`QQ/results/3: ${JSON.stringify(results)}`);
  return results;
};

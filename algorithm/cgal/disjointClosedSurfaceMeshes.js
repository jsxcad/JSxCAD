import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const disjointClosedSurfaceMeshes = (check, meshes) => {
  const results = [meshes[0]];
  getCgal().DisjointClosedSurfaceMeshesSingly(
    meshes.length,
    meshes,
    (nth) => meshes[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(meshes[nth].matrix),
    (nth, mesh) => {
      // Note: The 0th mesh is not emitted as it does not get cut.
      results.push({ mesh, matrix: meshes[nth].matrix });
    }
  );
  return results;
};

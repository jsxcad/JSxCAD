import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const remeshSurfaceMesh = (mesh, matrix, ...lengths) => {
  try {
    const remeshedMesh = getCgal().RemeshSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(matrix),
      () => {
        if (lengths.length > 0) {
          return lengths.shift();
        } else {
          return -1;
        }
      }
    );
    remeshedMesh.provenance = 'remesh';
    return remeshedMesh;
  } catch (error) {
    throw Error(error);
  }
};

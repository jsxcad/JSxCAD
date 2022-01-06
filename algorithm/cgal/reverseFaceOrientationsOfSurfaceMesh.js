import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const reverseFaceOrientationsOfSurfaceMesh = (mesh, transform) => {
  try {
    const reversedMesh = getCgal().ReverseFaceOrientationsOfSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform)
    );
    reversedMesh.provenance = 'reverseFaceOrientations';
    return reversedMesh;
  } catch (error) {
    throw Error(error);
  }
};

import { getCgal } from './getCgal.js';

export const minkowskiShellOfSurfaceMeshes = (
  mesh,
  meshTransform,
  offset,
  offsetTransform
) => {
  try {
    getCgal().MinkowskiShellOfSurfaceMeshes(
      mesh,
      meshTransform,
      offset,
      offsetTransform
    );
  } catch (error) {
    throw Error(error);
  }
};

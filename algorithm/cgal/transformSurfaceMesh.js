import { getCgal } from './getCgal.js';

export const transformSurfaceMesh = (mesh, jsTransform) => {
  try {
    return getCgal().TransformSurfaceMeshByTransform(mesh, jsTransform);
  } catch (error) {
    throw Error(error);
  }
};

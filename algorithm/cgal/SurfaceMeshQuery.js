import { getCgal } from './getCgal.js';

export const SurfaceMeshQuery = (mesh, transform) => {
  try {
    const c = getCgal();
    return new c.SurfaceMeshQuery(mesh, transform);
  } catch (error) {
    throw Error(error);
  }
};

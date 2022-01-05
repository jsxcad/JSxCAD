import { getCgal } from './getCgal.js';

export const deleteSurfaceMesh = (mesh) => {
  try {
    return getCgal().DeleteSurfaceMesh(mesh);
  } catch (error) {
    throw Error(error);
  }
};

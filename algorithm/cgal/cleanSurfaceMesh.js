import { getCgal } from './getCgal.js';

export const cleanSurfaceMesh = (mesh) => {
  try {
    const result = getCgal().CleanSurfaceMesh(mesh);
    result.provenance = 'clean';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

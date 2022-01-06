import { getCgal } from './getCgal.js';

export const growSurfaceMesh = (mesh, amount) => {
  try {
    const result = getCgal().GrowSurfaceMesh(mesh, amount);
    result.provenance = 'grow';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

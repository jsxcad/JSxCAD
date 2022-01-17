import { getCgal } from './getCgal.js';

export const demeshSurfaceMesh = (mesh) => {
  try {
    const result = getCgal().DemeshSurfaceMesh(mesh);
    result.provenance = 'demesh';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

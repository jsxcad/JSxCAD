import { getCgal } from './getCgal.js';

export const removeSelfIntersectionsOfSurfaceMesh = (mesh) => {
  try {
    const result = getCgal().RemoveSelfIntersectionsOfSurfaceMesh(mesh);
    result.provenance = 'removeSelfIntersections';
    return result;
  } catch (error) {
    throw Error(error);
  }
};

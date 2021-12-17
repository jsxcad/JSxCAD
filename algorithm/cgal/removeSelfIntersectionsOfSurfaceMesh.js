import { getCgal } from './getCgal.js';

export const removeSelfIntersectionsOfSurfaceMesh = (mesh) =>
  getCgal().RemoveSelfIntersectionsOfSurfaceMesh(mesh);

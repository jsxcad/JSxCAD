import { getCgal } from './getCgal.js';

export const fromSurfaceMeshEmitBoundingBox = (mesh, emit) =>
  getCgal().Surface_mesh__bbox(mesh, emit);

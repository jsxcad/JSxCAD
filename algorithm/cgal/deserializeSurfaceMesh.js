import { getCgal } from './getCgal.js';

export const deserializeSurfaceMesh = (mesh) =>
  getCgal().DeserializeSurfaceMesh(mesh);

import { getCgal } from './getCgal.js';

export const serializeSurfaceMesh = (mesh) =>
  getCgal().SerializeSurfaceMesh(mesh);

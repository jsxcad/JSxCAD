import { getCgal } from './getCgal.js';

// Note that the topology of an outline is disconnected.
export const outlineOfSurfaceMesh = (mesh) =>
  getCgal().OutlineOfSurfaceMesh(mesh);

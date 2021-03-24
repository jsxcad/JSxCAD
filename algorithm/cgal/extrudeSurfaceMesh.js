import { checkSelfIntersection } from './doesSelfIntersectOfSurfaceMesh.js';
import { getCgal } from './getCgal.js';

export const extrudeSurfaceMesh = (mesh, height, depth) =>
  checkSelfIntersection(getCgal().ExtrusionOfSurfaceMesh(mesh, height, depth));

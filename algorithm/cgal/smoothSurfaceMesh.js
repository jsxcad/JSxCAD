import { getCgal } from './getCgal.js';

export const smoothSurfaceMesh = (mesh, length, angle) =>
  getCgal().RemeshSurfaceMesh(
    mesh,
    length,
    angle,
    /* relaxation_steps= */ 1,
    /* iterations= */ 1
  );

import { getCgal } from './getCgal.js';

export const remeshSurfaceMesh = (
  mesh,
  { length = 1, angle = 10, relaxationSteps = 1, iterations = 1 }
) =>
  getCgal().RemeshSurfaceMesh(mesh, length, angle, relaxationSteps, iterations);

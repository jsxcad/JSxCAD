import { getCgal } from './getCgal.js';

export const smoothSurfaceMesh = (
  mesh,
  { targetLength = 1, iterations = 1 } = {}
) => getCgal().SmoothSurfaceMesh(mesh, targetLength, iterations);

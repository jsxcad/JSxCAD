import { getCgal } from './getCgal.js';

export const fromFunctionToSurfaceMesh = (
  op,
  { radius = 1, angularBound = 30, radiusBound = 0.1, distanceBound = 0.1 } = {}
) =>
  getCgal().FromFunctionToSurfaceMesh(
    radius,
    angularBound,
    radiusBound,
    distanceBound,
    op
  );

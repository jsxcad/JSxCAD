import { getCgal } from './getCgal.js';

export const fromFunctionToSurfaceMesh = (
  op,
  {
    radius = 1,
    angularBound = 30, // minimum angle
    radiusBound = 0.1, // maximum facet size
    distanceBound = 0.1, // maximum facet divergence
    errorBound = 0.001,
  } = {}
) =>
  getCgal().FromFunctionToSurfaceMesh(
    radius,
    angularBound,
    radiusBound,
    distanceBound,
    errorBound,
    op
  );

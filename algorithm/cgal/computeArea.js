import { withCgalGeometry } from './cgalGeometry.js';

export const computeArea = (linear) =>
  withCgalGeometry('computeArea', linear, (geometry, g) =>
    g.ComputeArea(geometry)
  );

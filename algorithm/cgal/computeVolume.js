import { withCgalGeometry } from './cgalGeometry.js';

export const computeVolume = (linear) =>
  withCgalGeometry('computeVolume', linear, (geometry, g) =>
    g.ComputeVolume(geometry)
  );

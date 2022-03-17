import { getCgal } from './getCgal.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const computeVolume = (linear) =>
  withCgalGeometry(linear, (geometry, g) => g.ComputeVolume(geometry));

import { getCgal } from './getCgal.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const computeArea = (linear) =>
  withCgalGeometry(linear, (geometry, g) => g.ComputeArea(geometry));

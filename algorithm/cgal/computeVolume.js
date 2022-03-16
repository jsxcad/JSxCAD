import { getCgal } from './getCgal.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const computeArea = (linear) =>
  withCgalGeometry(linear, getCgal().ComputeVolume);

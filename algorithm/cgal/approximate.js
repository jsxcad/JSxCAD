import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const approximate = (
  inputs,
  iterations,
  relaxationSteps,
  minimumErrorDrop,
  subdivisionRatio,
  relativeToChord = false,
  withDihedralAngle = false,
  optimizeAnchorLocation = true,
  pcaPlane = false,
  maxNumberOfProxies
) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Approximate(
      cgalGeometry,
      iterations !== undefined,
      iterations,
      relaxationSteps !== undefined,
      relaxationSteps,
      minimumErrorDrop !== undefined,
      minimumErrorDrop,
      subdivisionRatio !== undefined,
      subdivisionRatio,
      relativeToChord,
      withDihedralAngle,
      optimizeAnchorLocation,
      pcaPlane,
      maxNumberOfProxies !== undefined,
      maxNumberOfProxies
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by bend');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

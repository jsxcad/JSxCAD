import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const smooth = (
  inputs,
  count,
  resolution = 1,
  steps = 1,
  time = 1,
  remeshIterations = 1,
  remeshRelaxationSteps = 1
) =>
  withCgalGeometry('smooth', inputs, (cgalGeometry, g) => {
    const status = g.Smooth(
      cgalGeometry,
      count,
      resolution,
      steps,
      time,
      remeshIterations,
      remeshRelaxationSteps
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by smooth');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

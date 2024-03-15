import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const smooth = (
  inputs,
  count,
  resolution = 0.25,
  steps = 1,
  time = 1,
  remeshIterations = 1,
  remeshRelaxationSteps = 1
) =>
  withCgalGeometry('smooth', inputs, (cgalGeometry, g) => {
    const status = g.Smooth(
      cgalGeometry,
      Number(count),
      Number(resolution),
      Number(steps),
      Number(time),
      Number(remeshIterations),
      Number(remeshRelaxationSteps)
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

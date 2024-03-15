import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const fair = (
  inputs,
  count,
  resolution = 1,
  numberOfIterations = 1,
  remeshIterations = 1,
  remeshRelaxationSteps = 1
) =>
  withCgalGeometry('fair', inputs, (cgalGeometry, g) => {
    const status = g.Fair(
      cgalGeometry,
      Number(count),
      Number(resolution),
      Number(numberOfIterations),
      Number(remeshIterations),
      Number(remeshRelaxationSteps)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by fair');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

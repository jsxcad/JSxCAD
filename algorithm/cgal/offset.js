import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const offset = (
  inputs,
  initial = 1,
  step = -1,
  limit = -1,
  segments = 16
) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Offset(cgalGeometry, initial, step, limit, segments);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by offset');
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length
        );
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
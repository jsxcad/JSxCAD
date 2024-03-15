import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

// FIX
export const deform = (
  inputs,
  length,
  iterations = 1000,
  tolerance = 0.0001,
  alpha = 0.02
) => {
  return withCgalGeometry('deform', inputs, (cgalGeometry, g) => {
    const status = g.Deform(
      cgalGeometry,
      Number(length),
      Number(iterations),
      Number(tolerance),
      Number(alpha)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by deform');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, 1);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const clip = (inputs, targetsLength, open = false, exact = false) =>
  withCgalGeometry('clip', inputs, (cgalGeometry, g) => {
    const status = g.Clip(cgalGeometry, targetsLength, open, exact);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by clip');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, targetsLength);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

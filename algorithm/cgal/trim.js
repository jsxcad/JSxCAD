import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const trim = (inputs, count) =>
  withCgalGeometry('trim', inputs, (cgalGeometry, g) => {
    const status = g.Trim(cgalGeometry, Number(count));
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by trim');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status} in trim`);
    }
  });

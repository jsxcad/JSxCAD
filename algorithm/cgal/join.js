import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const join = (inputs, targetsLength, exact = false) =>
  withCgalGeometry('join', inputs, (cgalGeometry, g) => {
    const status = g.Join(cgalGeometry, Number(targetsLength), Boolean(exact));
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by join');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, targetsLength);
      default:
        throw new Error(`Unexpected status ${status} in join`);
    }
  });

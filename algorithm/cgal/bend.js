import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const bend = (inputs, targetsLength, edgeLength = 1) =>
  withCgalGeometry('bend', inputs, (cgalGeometry, g) => {
    const status = g.Bend(
      cgalGeometry,
      Number(targetsLength),
      Number(edgeLength)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by bend');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status} in bend`);
    }
  });

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const fair = (inputs, count, density = 0) =>
  withCgalGeometry('fair', inputs, (cgalGeometry, g) => {
    const status = g.Fair(cgalGeometry, count, density);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by fair');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const grow = (inputs, count, { x = true, y = true, z = true } = {}) =>
  withCgalGeometry('grow', inputs, (cgalGeometry, g) => {
    const status = g.Grow(
      cgalGeometry,
      Number(count),
      Number(x),
      Number(y),
      Number(z)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by grow');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

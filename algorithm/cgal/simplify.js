import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const simplify = (inputs, ratio = 0.5, eps) =>
  withCgalGeometry('simplify', inputs, (cgalGeometry, g) => {
    const status = g.Simplify(cgalGeometry, ratio, eps !== undefined, eps || 0);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by simplify');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

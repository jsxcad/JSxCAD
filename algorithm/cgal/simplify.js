import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const simplify = (inputs, cornerThreshold, eps) =>
  withCgalGeometry('simplify', inputs, (cgalGeometry, g) => {
    const status = g.Simplify(
      cgalGeometry,
      Number(cornerThreshold),
      eps !== undefined,
      Number(eps) || 0,
      false
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by simplify');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status} in simplify`);
    }
  });

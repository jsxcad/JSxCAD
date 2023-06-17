import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const eagerTransform = (inputs) =>
  withCgalGeometry('eagerTransform', inputs, (cgalGeometry, g) => {
    const status = g.EagerTransform(cgalGeometry, inputs.length - 1);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by eagerTransform'
        );
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, inputs.length - 1);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

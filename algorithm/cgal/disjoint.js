import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const disjoint = (inputs, mode, exact = false) =>
  withCgalGeometry(inputs, (geometry, g) => {
    // These are custom inputs.
    const getIsMasked = (nth) =>
      inputs[nth].tags && inputs[nth].tags.includes('type:masked');
    const status = g.Disjoint(geometry, getIsMasked, mode, exact);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by disjoint');
      case STATUS_OK:
        return fromCgalGeometry(geometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

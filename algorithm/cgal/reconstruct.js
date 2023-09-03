import {
  STATUS_INVALID_INPUT,
  STATUS_OK,
  STATUS_ZERO_THICKNESS,
} from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const reconstruct = (inputs) =>
  withCgalGeometry('reconstruct', inputs, (cgalGeometry, g) => {
    const status = g.Reconstruct(cgalGeometry);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by reconstruct');
      case STATUS_INVALID_INPUT:
        throw new ErrorZeroThickness('Reconstruction failed');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const faces = (inputs) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Faces(cgalGeometry);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by faces');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

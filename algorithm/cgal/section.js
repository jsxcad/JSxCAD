import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const section = (inputs, count) =>
  withCgalGeometry('section', inputs, (cgalGeometry, g) => {
    const status = g.Section(cgalGeometry, Number(count));
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by section');
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length,
          /* regroup= */ true
        );
      default:
        throw new Error(`Unexpected status ${status} in section`);
    }
  });

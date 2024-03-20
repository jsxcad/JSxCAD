import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const shell = (
  inputs,
  innerOffset,
  outerOffset,
  protect = false,
  angle = 30,
  sizing = 1,
  approx = 0.1,
  edgeSize = 1
) => {
  return withCgalGeometry('shell', inputs, (cgalGeometry, g) => {
    const status = g.Shell(
      cgalGeometry,
      Number(innerOffset),
      Number(outerOffset),
      Boolean(protect),
      Number(angle),
      Number(sizing),
      Number(approx),
      Number(edgeSize)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by shell');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

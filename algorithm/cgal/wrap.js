import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const wrap = (
  inputs,
  alpha,
  offset,
  faceCount = 0,
  minErrorDrop = 0.0
) =>
  withCgalGeometry('wrap', inputs, (cgalGeometry, g) => {
    console.log(
      `QQ/wrap: ${JSON.stringify({ alpha, offset, faceCount, minErrorDrop })}`
    );
    const status = g.Wrap(
      cgalGeometry,
      Number(alpha),
      Number(offset),
      Number(faceCount),
      Number(minErrorDrop)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by wrap');
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length
        );
      default:
        throw new Error(`Unexpected status ${status} in wrap`);
    }
  });

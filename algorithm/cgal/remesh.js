import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const remesh = (
  inputs,
  count,
  iterations,
  relaxationSteps,
  targetEdgeLength
) =>
  withCgalGeometry('remesh', inputs, (cgalGeometry, g) => {
    const status = g.Remesh(
      cgalGeometry,
      Number(count),
      Number(iterations),
      Number(relaxationSteps),
      Number(targetEdgeLength)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by remesh');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status} in remesh`);
    }
  });

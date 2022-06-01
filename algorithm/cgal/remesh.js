import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const remesh = (
  inputs,
  count,
  iterations,
  relaxationSteps,
  targetEdgeLength,
  exact
) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Remesh(
      cgalGeometry,
      count,
      iterations,
      relaxationSteps,
      targetEdgeLength,
      exact
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by remesh');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

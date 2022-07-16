import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const smooth = (
  inputs,
  count,
  resolution = 1,
  steps = 1,
  time = 1,
  remesh_iterations = 1,
  remesh_relaxation_steps = 1
) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Smooth(
      cgalGeometry,
      count,
      resolution,
      steps,
      time,
      remesh_iterations,
      remesh_relaxation_steps
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by smooth');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, count);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

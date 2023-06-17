import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const computeImplicitVolume = (
  op,
  radius = 1,
  angularBound = 30,
  radiusBound = 0.1,
  distanceBound = 0.1,
  errorBound = 0.001
) =>
  withCgalGeometry('computeImplicitVolume', [], (cgalGeometry, g) => {
    const status = g.ComputeImplicitVolume(
      cgalGeometry,
      op,
      radius,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeImplicitVolume'
        );
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, [], cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

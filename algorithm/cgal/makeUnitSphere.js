import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const makeUnitSphere = (angularBound, radiusBound, distanceBound) =>
  withCgalGeometry([], (cgalGeometry, g) => {
    const status = g.MakeUnitSphere(
      cgalGeometry,
      angularBound,
      radiusBound,
      distanceBound
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by makeOrb');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, [], cgalGeometry.getSize())[0];
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

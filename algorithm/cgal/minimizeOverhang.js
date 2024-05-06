import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const minimizeOverhang = (inputs, threshold, split = false) =>
  withCgalGeometry('minimizeOverhang', inputs, (cgalGeometry, g) => {
    const status = g.MinimizeOverhang(
      cgalGeometry,
      Number(threshold),
      Boolean(split)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by overhang');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status} in overhang`);
    }
  });

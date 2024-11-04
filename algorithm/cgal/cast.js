import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const cast = (inputs) => {
  console.log(`QQ/cast: inputs=${JSON.stringify(inputs)}`);
  return withCgalGeometry('cast', inputs, (cgalGeometry, g) => {
    const status = g.Cast(cgalGeometry);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by cast');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status} in cast`);
    }
  });
};

import { STATUS_OK } from './status.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const eachPoint = (inputs, emit) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.EachPoint(cgalGeometry, (x, y, z) => emit([x, y, z]));
    switch (status) {
      case STATUS_OK:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

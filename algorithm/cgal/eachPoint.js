import { STATUS_OK } from './status.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const eachPoint = (inputs, emit) =>
  withCgalGeometry('eachPoint', inputs, (cgalGeometry, g) => {
    const status = g.EachPoint(cgalGeometry, (x, y, z, exact) =>
      emit([x, y, z, exact])
    );
    switch (status) {
      case STATUS_OK:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

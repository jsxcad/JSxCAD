import { STATUS_OK } from './status.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const eachPoint = (inputs, emit) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.EachPoint(cgalGeometry, emit);
    switch (status) {
      case STATUS_OK:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

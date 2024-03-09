import { STATUS_EMPTY, STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { ErrorZeroThickness } from './error.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const computeBoundingBox = (inputs) => {
  if (inputs.length === 0) {
    return;
  }
  return withCgalGeometry('computeBoundingBox', inputs, (cgalGeometry, g) => {
    const bbox = [];
    const status = g.ComputeBoundingBox(cgalGeometry, bbox);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeBoundingBox'
        );
      case STATUS_OK:
        return bbox;
      case STATUS_EMPTY:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

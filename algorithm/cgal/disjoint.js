import {
  STATUS_OK,
  STATUS_UNCHANGED,
  STATUS_ZERO_THICKNESS,
} from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const disjoint = (inputs, mode, exact = false) =>
  withCgalGeometry('disjoint', inputs, (geometry, g) => {
    // These are custom inputs.
    const isMasked = inputs.map(
      ({ tags }) => tags && tags.includes('type:masked')
    );
    const status = g.Disjoint(geometry, isMasked, mode ? 1 : 0, exact);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by disjoint');
      case STATUS_OK:
        return fromCgalGeometry(geometry, inputs);
      case STATUS_UNCHANGED:
        return inputs;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

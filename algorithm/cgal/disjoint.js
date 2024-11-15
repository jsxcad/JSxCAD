import {
  STATUS_INVALID_INPUT,
  STATUS_OK,
  STATUS_UNCHANGED,
  STATUS_ZERO_THICKNESS,
} from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const disjoint = (inputs, exact = false) =>
  withCgalGeometry('disjoint', inputs, (geometry, g) => {
    // These are custom inputs.
    const isMasked = inputs.map(
      ({ tags }) => tags && tags.includes('type:masked')
    );
      const status = g.Disjoint(geometry, isMasked, Boolean(exact));
      switch (status) {
        case STATUS_ZERO_THICKNESS:
          throw new ErrorZeroThickness('Zero thickness produced by disjoint');
        case STATUS_OK:
          return fromCgalGeometry(geometry, inputs);
        case STATUS_UNCHANGED:
          return inputs;
        case STATUS_INVALID_INPUT:
          if (!exact) {
            // Retry with exact geometry.
            return disjoint(inputs, true);
          }
          throw new Error(`Disjoint failed due to bad geometry`);
          break;
        default:
          throw new Error(`Unexpected status ${status} in disjoint`);
      }
  });

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const generateEnvelope = (inputs, envelopeType) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.GenerateEnvelope(cgalGeometry, envelopeType);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by generateEnvelope'
        );
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

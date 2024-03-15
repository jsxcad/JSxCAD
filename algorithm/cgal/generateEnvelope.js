import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const generateEnvelope = (
  inputs,
  envelopeType,
  { plan, face, edge } = {}
) =>
  withCgalGeometry('generateEnvelope', inputs, (cgalGeometry, g) => {
    const status = g.GenerateEnvelope(
      cgalGeometry,
      Number(envelopeType),
      Boolean(plan),
      Boolean(face),
      Boolean(edge)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by generateEnvelope'
        );
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length
        );
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { STATUS_OK } from './status.js';

export const pack = (
  inputs,
  count,
  orientations = [],
  { perimeterWeight = 1, boundsWeight = 1, holesWeight = 1 } = {},
  sheetByInput = []
) =>
  withCgalGeometry('pack', inputs, (cgalGeometry, g) => {
    const status = g.Pack(
      cgalGeometry,
      Number(count),
      orientations,
      perimeterWeight,
      boundsWeight,
      holesWeight,
      sheetByInput
    );
    switch (status) {
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status} in pack`);
    }
  });

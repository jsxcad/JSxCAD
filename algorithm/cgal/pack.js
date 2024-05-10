import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { STATUS_OK } from './status.js';

export const pack = (inputs) =>
  withCgalGeometry('pack', inputs, (cgalGeometry, g) => {
    const status = g.Pack(cgalGeometry);
    switch (status) {
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status} in pack`);
    }
  });

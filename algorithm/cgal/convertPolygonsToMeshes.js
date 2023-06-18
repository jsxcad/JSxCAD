import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const convertPolygonsToMeshes = (inputs) =>
  withCgalGeometry('convertPolygonsToMeshes', inputs, (cgalGeometry, g) => {
    const status = g.ConvertPolygonsToMeshes(cgalGeometry);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by convertPolygonsToMeshes'
        );
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

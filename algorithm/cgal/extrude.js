import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const extrude = (inputs, top, bottom) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Extrude(
      cgalGeometry,
      toCgalTransformFromJsTransform(top.matrix),
      toCgalTransformFromJsTransform(bottom.matrix)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by extrude');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

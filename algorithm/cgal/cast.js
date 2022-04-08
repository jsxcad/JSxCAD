import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cast = (inputs, reference) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.Cast(
      cgalGeometry,
      toCgalTransformFromJsTransform(reference.matrix)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by cast');
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

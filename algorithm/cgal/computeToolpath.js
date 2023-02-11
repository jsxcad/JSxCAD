import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const computeToolpath = (
  inputs,
  material,
  selection,
  toolSpacing,
  toolSize,
  toolCutDepth
) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.ComputeToolpath(
      cgalGeometry,
      material,
      selection,
      toolSpacing,
      toolSize,
      toolCutDepth
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeToolpath'
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

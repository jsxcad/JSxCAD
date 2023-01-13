import { STATUS_EMPTY, STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';
import { ErrorZeroThickness } from './error.js';

export const computeOrientedBoundingBox = (inputs) => {
  if (inputs.length === 0) {
    return;
  }
  return withCgalGeometry(inputs, (cgalGeometry, g) => {
    const status = g.ComputeOrientedBoundingBox(cgalGeometry);
    // This adds segments with twelve entries: length, depth, height, ...
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeOrientedBoundingBox'
        );
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          inputs.length + 1,
          inputs.length
        );
      case STATUS_EMPTY:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

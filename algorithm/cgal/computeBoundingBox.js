import { STATUS_EMPTY, STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { ErrorZeroThickness } from './error.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const computeBoundingBox = (inputs) => {
  if (inputs.length === 0) {
    return;
  }
  return withCgalGeometry('computeBoundingBox', inputs, (cgalGeometry, g) => {
    let bbox;
    const status = g.ComputeBoundingBox(
      cgalGeometry,
      (minX, minY, minZ, maxX, maxY, maxZ) => {
        bbox = [
          [minX, minY, minZ],
          [maxX, maxY, maxZ],
        ];
      }
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeBoundingBox'
        );
      case STATUS_OK:
        return bbox;
      case STATUS_EMPTY:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

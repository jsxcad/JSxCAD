import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const separate = (
  inputs,
  keepShapes = true,
  keepHolesInShapes = true,
  keepHolesAsShapes = false
) =>
  withCgalGeometry('separate', inputs, (cgalGeometry, g) => {
    const status = g.Separate(
      cgalGeometry,
      keepShapes,
      keepHolesInShapes,
      keepHolesAsShapes
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by separate');
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

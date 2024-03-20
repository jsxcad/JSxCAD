import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const unfold = (inputs, enableTabs = false) =>
  withCgalGeometry('unfold', inputs, (cgalGeometry, g) => {
    const tags = [];
    // Not sure that passing tags around like this is a sensible idea.
    const status = g.Unfold(
      cgalGeometry,
      Boolean(enableTabs),
      (nth, tag) => (tags[nth] = tag)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by section');
      case STATUS_OK:
        const output = fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length
        );
        for (let nth = 0; nth < tags.length; nth++) {
          if (!tags[nth]) {
            continue;
          }
          const entry = output[nth - inputs.length];
          entry.tags = [...entry.tags, tags[nth]];
        }
        return output;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

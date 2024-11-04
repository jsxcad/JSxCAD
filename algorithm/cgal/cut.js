import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const cut = (inputs, targetsLength, open = false, exact = false) => {
  // console.log(`QQ/cut: inputs=${JSON.stringify({ inputs, targetsLength, open, exact })}`);
  return withCgalGeometry('cut', inputs, (cgalGeometry, g) => {
    const status = g.Cut(
      cgalGeometry,
      Number(targetsLength),
      Boolean(open),
      Boolean(exact)
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by cut');
      case STATUS_OK:
        const result = fromCgalGeometry(cgalGeometry, inputs, targetsLength);
        // console.log(`QQ/cut: result=${JSON.stringify(result)}`);
        return result;
      default:
        throw new Error(`Unexpected status ${status} in cut`);
    }
  });
};

import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { STATUS_OK } from './status.js';

export const validate = (inputs, strategies = []) => {
  const strategyCodes = [];
  for (const strategy of strategies) {
    switch (strategy) {
      case 'selfIntersection':
        strategyCodes.push(0);
        break;
      default:
        throw new Error(`Repair strategy: ${strategy} not in [].`);
    }
  }
  if (strategyCodes.length === 0) {
    // Default to everything.
    strategyCodes.push(0);
  }
  return withCgalGeometry('validate', inputs, (cgalGeometry, g) => {
    const status = g.Validate(cgalGeometry, () => strategyCodes.pop() || -1);
    switch (status) {
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};

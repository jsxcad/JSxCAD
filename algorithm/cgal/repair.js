import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const provideRepairStrategies = (strategies) => {
  const strategyCodes = [];
  for (const strategy of strategies) {
    switch (strategy) {
      case 'auto':
        strategyCodes.push(0);
        break;
      case 'patch':
        strategyCodes.push(1);
        break;
      case 'wrap':
        strategyCodes.push(2);
        break;
      case 'close':
        strategyCodes.push(3);
        break;
      default:
        throw new Error(
          `Repair strategy: ${strategy} not in ['auto', 'close', 'patch', 'wrap'].`
        );
    }
  }
  return () => strategyCodes.shift() || -1;
};

export const repair = (inputs, strategies = []) =>
  withCgalGeometry('repair', inputs, (cgalGeometry, g) => {
    const status = g.Repair(cgalGeometry, provideRepairStrategies(strategies));
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by repair');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

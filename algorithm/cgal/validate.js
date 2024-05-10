import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { STATUS_OK } from './status.js';

const kAllStrategies = [
  'isNotSelfIntersecting',
  'isClosed',
  'isManifold',
  'isNotDegenerate',
];

export const validate = (inputs, strategies = []) => {
  const strategyCodes = [];
  for (const strategy of strategies) {
    switch (strategy) {
      case 'isNotSelfIntersecting':
        strategyCodes.push(0);
        break;
      case 'isClosed':
        strategyCodes.push(1);
        break;
      case 'isManifold':
        strategyCodes.push(2);
        break;
      case 'isNotDegenerate':
        strategyCodes.push(3);
        break;
      default:
        throw new Error(
          `Repair strategy: ${strategy} not in ${kAllStrategies}.`
        );
    }
  }
  if (strategyCodes.length === 0) {
    strategyCodes.push(0, 1, 2, 3);
  }
  return withCgalGeometry('validate', inputs, (cgalGeometry, g) => {
    const status = g.Validate(cgalGeometry, strategyCodes);
    switch (status) {
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, inputs, cgalGeometry.getSize());
      default:
        throw new Error(`Unexpected status ${status} in validate`);
    }
  });
};

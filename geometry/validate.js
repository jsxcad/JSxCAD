import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { validate as validateWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const validate = (geometry, strategies) => {
  const inputs = linearize(geometry, filter);
  const outputs = validateWithCgal(inputs, strategies);
  return replacer(inputs, outputs)(geometry);
};

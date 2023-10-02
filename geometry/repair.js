import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { repair as repairWithCgal } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const repair = (geometry, strategies) => {
  const inputs = linearize(geometry, filter);
  const outputs = repairWithCgal(inputs, strategies);
  return replacer(inputs, outputs)(geometry);
};

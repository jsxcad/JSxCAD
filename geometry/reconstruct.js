import { isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { linearize } from './tagged/linearize.js';
import { reconstruct as reconstructWithCgal } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';

const filter = () => (geometry) =>
  ['graph'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

export const reconstruct = (geometry, { offset } = {}) => {
  const inputs = linearize(geometry, filter());
  const outputs = reconstructWithCgal(inputs, offset);
  return replacer(inputs, outputs)(geometry);
};

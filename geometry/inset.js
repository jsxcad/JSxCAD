import { inset as insetWithCgal } from '@jsxcad/algorithm-cgal';

import { Group } from './Group.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const inset = (geometry, initial = 1, { segments = 16, step, limit} = {}) => {
  const inputs = linearize(geometry, filter);
  const outputs = insetWithCgal(inputs, initial, step, limit, segments);
  // Put the inner insets first.
  return Group(outputs);
};

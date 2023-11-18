import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { fair as fairWithCgal } from '@jsxcad/algorithm-cgal';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const fair = (geometry, selections, { density } = {}) => {
  const inputs = [];
  linearize(geometry, filter, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter, inputs);
  }
  const outputs = fairWithCgal(inputs, count, density);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return taggedGroup({}, replacer(inputs, outputs, count)(geometry), ...ghosts);
};

import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { Group } from './Group.js';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { trim as trimWithCgal } from '@jsxcad/algorithm-cgal';

const filter = (geometry, parent) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const trim = (geometry, tool) => {
  const inputs = linearize(geometry, filter);
  const count = inputs.length;
  linearize(tool, filter, inputs);
  const outputs = trimWithCgal(inputs, count);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([replacer(inputs, outputs)(geometry), ...ghosts]);
};

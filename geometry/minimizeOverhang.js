import { hasTypeGhost, isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { minimizeOverhang as minimizeOverhangWithCgal } from '@jsxcad/algorithm-cgal';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

export const minimizeOverhang = (
  geometry,
  threshold = 130,
  { split = false } = {}
) => {
  const inputs = linearize(geometry, filter);
  const count = inputs.length;
  const outputs = minimizeOverhangWithCgal(inputs, threshold, split);
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([replacer(inputs, outputs, count)(geometry), ...ghosts]);
};

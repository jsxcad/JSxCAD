import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { Group } from './Group.js';
import { Z } from './Ref.js';
import { grow as growWithCgal } from '@jsxcad/algorithm-cgal';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const grow = (geometry, offset, axes = 'xyz', selections) => {
  const inputs = linearize(geometry, filter);
  const count = inputs.length;
  inputs.push(Z(offset));
  for (const selection of selections) {
    linearize(selection, filter, inputs);
  }
  const outputs = growWithCgal(inputs, count, {
    x: axes.includes('x'),
    y: axes.includes('y'),
    z: axes.includes('z'),
  });
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([replacer(inputs, outputs)(geometry), ...ghosts]);
};

import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { dilateXY as dilateXYWithCgal } from '@jsxcad/algorithm-cgal';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const dilateXY = (geometry, amount) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = dilateXYWithCgal(inputs, amount);
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

import {
  deletePendingSurfaceMeshes,
  grow as growWithCgal,
} from '@jsxcad/algorithm-cgal';
import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const grow = (geometry, offset, selections, options) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const count = inputs.length;
  inputs.push(offset);
  for (const selection of selections) {
    linearize(toConcreteGeometry(selection), filter, inputs);
  }
  const outputs = growWithCgal(inputs, count, options);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

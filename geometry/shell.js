import {
  deletePendingSurfaceMeshes,
  shell as shellWithCgal,
} from '@jsxcad/algorithm-cgal';
import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry, parent) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const shell = (
  geometry,
  innerOffset = 0,
  outerOffset = 0,
  protect = false,
  angle = 30 / 360,
  sizing = 1,
  approx = 0.1,
  edgeLength = 1
) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter, inputs);
  const outputs = shellWithCgal(
    inputs,
    innerOffset,
    outerOffset,
    protect,
    angle * 360,
    sizing,
    approx,
    edgeLength
  );
  const ghosts = [];
  for (let nth = 0; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs)(concreteGeometry),
    ...ghosts
  );
};

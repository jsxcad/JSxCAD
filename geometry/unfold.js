import {
  deletePendingSurfaceMeshes,
  unfold as unfoldWithCgal,
} from '@jsxcad/algorithm-cgal';
import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterInputs = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const unfold = (inputGeometry) => {
  const concreteGeometry = toConcreteGeometry(inputGeometry);
  const inputs = [];
  linearize(concreteGeometry, filterInputs, inputs);
  const count = inputs.length;
  const outputs = unfoldWithCgal(inputs);
  const ghosts = [];
  for (let nth = 0; nth < count; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup({}, ...outputs, ...ghosts);
};

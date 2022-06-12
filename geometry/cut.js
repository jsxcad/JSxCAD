import {
  cut as cutWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import {
  hasTypeGhost,
  isNotTypeGhost,
  isNotTypeMasked,
  isTypeVoid,
} from './tagged/type.js';

import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterTargets = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

const filterRemoves = (geometry) =>
  filterTargets(geometry) &&
  isNotTypeMasked(geometry) &&
  (isNotTypeGhost(geometry) || isTypeVoid(geometry));

export const cut = (geometry, geometries, open = false) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets, inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterRemoves, inputs);
  }
  const outputs = cutWithCgal(inputs, count, open);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasTypeGhost(inputs[nth]));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

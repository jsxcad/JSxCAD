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

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filterTargets = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

const filterRemoves = (noVoid) => (geometry) =>
  filterTargets(noVoid)(geometry) && isNotTypeMasked(geometry);

export const cut = (geometry, geometries, open = false, exact, noVoid) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filterTargets(noVoid), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filterRemoves(noVoid), inputs);
  }
  const outputs = cutWithCgal(inputs, count, open, exact);
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

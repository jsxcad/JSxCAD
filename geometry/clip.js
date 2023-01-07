import {
  clip as clipWithCgal,
  deletePendingSurfaceMeshes,
} from '@jsxcad/algorithm-cgal';
import { hasTypeGhost, isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid(geometry)));

export const clip = (geometry, geometries, open, exact, noVoid, noGhost) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const inputs = [];
  linearize(concreteGeometry, filter(noVoid), inputs);
  const count = inputs.length;
  for (const geometry of geometries) {
    linearize(geometry, filter(noVoid), inputs);
  }
  const outputs = clipWithCgal(inputs, count, open, exact);
  const ghosts = [];
  if (!noGhost) {
    for (let nth = 0; nth < inputs.length; nth++) {
      ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
    }
  }
  deletePendingSurfaceMeshes();
  return taggedGroup(
    {},
    replacer(inputs, outputs, count)(concreteGeometry),
    ...ghosts
  );
};

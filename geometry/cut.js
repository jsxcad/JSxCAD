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

import { clip } from './clip.js';
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

export const cut = (
  toCut,
  toClips,
  { open = false, exact, noVoid, noGhost }
) => {
  const concreteGeometry = toConcreteGeometry(toCut);
  const inputs = [];
  linearize(concreteGeometry, filterTargets(noVoid), inputs);
  const count = inputs.length;
  for (const toClip of toClips) {
    linearize(toClip, filterRemoves(noVoid), inputs);
  }
  const outputs = cutWithCgal(inputs, count, open, exact);
  const ghosts = [];
  if (!noGhost) {
    for (let nth = count; nth < inputs.length; nth++) {
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

export const Cut = ([first, ...rest], modes) =>
  cut(first, rest, modes);

export const cutFrom = (toClip, toCut, options) => cut(toCut, [toClip], options);

export const cutOut = (cutGeometry, clipGeometry, modes) =>
  [cut(cutGeometry, [clipGeometry], { ...modes, noGhost: true }), clip(cutGeometry, [clipGeometry], { ...modes, noGhost: true })]

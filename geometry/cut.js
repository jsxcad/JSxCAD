import {
  hasTypeGhost,
  isNotTypeGhost,
  isNotTypeMasked,
  isTypeVoid,
} from './tagged/type.js';

import { Group } from './Group.js';
import { clip } from './clip.js';
import { cut as cutWithCgal } from '@jsxcad/algorithm-cgal';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

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
  const inputs = linearize(toCut, filterTargets(noVoid));
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
  const results = Group([replacer(inputs, outputs, count)(toCut), ...ghosts]);
  console.log(`QQ/cut/results: ${JSON.stringify(results)}`);
  return results;
};

export const cutFrom = (toClip, toCut, options) =>
  cut(toCut, [toClip], options);

export const cutOut = (cutGeometry, clipGeometry, modes) => [
  cut(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
  clip(cutGeometry, [clipGeometry], { ...modes, noGhost: true }),
];

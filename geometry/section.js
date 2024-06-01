import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { Group } from './Group.js';
import { Ref } from './Ref.js';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { section as sectionWithCgal } from '@jsxcad/algorithm-cgal';

const filterInputs = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

export const section = (geometry, referenceGeometries = []) => {
  const inputs = linearize(geometry, filterInputs);
  const count = inputs.length;
  if (referenceGeometries.length === 0) {
    // Default to the Z(0) plane.
    inputs.push(Ref());
  } else {
    for (const referenceGeometry of referenceGeometries) {
      linearize(referenceGeometry, filterReferences, inputs);
    }
  }
  const ghosts = [];
  for (let nth = 0; nth < count; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  const outputs = sectionWithCgal(inputs, count);
  const updated = replacer(inputs, outputs, count)(geometry);
  return Group([updated, ...ghosts]);
};

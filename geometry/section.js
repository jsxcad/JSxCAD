import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { Group } from './Group.js';
import { Ref } from './Ref.js';
import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { section as sectionWithCgal } from '@jsxcad/algorithm-cgal';

const filterInputs = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

const filterReferences = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points', 'empty'].includes(
    geometry.type
  );

export const section = (inputGeometry, referenceGeometries = []) => {
  const inputs = linearize(inputGeometry, filterInputs);
  const count = inputs.length;
  if (referenceGeometries.length === 0) {
    // Default to the Z(0) plane.
    inputs.push(Ref());
  } else {
    for (const referenceGeometry of referenceGeometries) {
      linearize(referenceGeometry, filterReferences, inputs);
    }
  }
  const outputs = sectionWithCgal(inputs, count);
  const ghosts = [];
  for (let nth = 0; nth < count; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return Group([...outputs, ...ghosts]);
};

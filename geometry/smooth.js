import { hasTypeGhost, isNotTypeGhost } from './tagged/type.js';

import { hasMaterial } from './hasMaterial.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';
import { smooth as smoothWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) && isNotTypeGhost(geometry);

export const smooth = (
  geometry,
  selections,
  resolution,
  iterations,
  time,
  remeshIterations,
  remeshRelaxationSteps
) => {
  const inputs = [];
  linearize(geometry, filter, inputs);
  const count = inputs.length;
  for (const selection of selections) {
    linearize(selection, filter, inputs);
  }
  const outputs = smoothWithCgal(
    inputs,
    count,
    resolution,
    iterations,
    time,
    remeshIterations,
    remeshRelaxationSteps
  );
  const ghosts = [];
  for (let nth = count; nth < inputs.length; nth++) {
    ghosts.push(hasMaterial(hasTypeGhost(inputs[nth]), 'ghost'));
  }
  return taggedGroup({}, replacer(inputs, outputs, count)(geometry), ...ghosts);
};

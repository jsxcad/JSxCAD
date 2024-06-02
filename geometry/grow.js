import { grow as growWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry, parent) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const grow = (geometry, tool) => {
  const inputs = linearize(geometry, filter);
  const count = inputs.length;
  linearize(tool, filter, inputs);
  const outputs = growWithCgal(inputs, count);
  return replacer(inputs, outputs)(geometry);
};

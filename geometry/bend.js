import { bend as bendWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { replacer } from './tagged/visit.js';

const filter = (geometry) =>
  ['graph', 'points', 'segments', 'polygonsWithHoles'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const bend = (geometry, radius = 100, edgeLength = 1) => {
  const inputs = linearize(geometry, filter);
  const outputs = bendWithCgal(inputs, radius, edgeLength);
  return replacer(inputs, outputs)(geometry);
};

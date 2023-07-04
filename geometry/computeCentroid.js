import { Group } from './Group.js';
import { computeCentroid as computeCentroidWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const computeCentroid = (geometry, top, bottom) =>
  Group(computeCentroidWithCgal(linearize(geometry, filter)));

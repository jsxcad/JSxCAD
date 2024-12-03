import {
  computeNormal as computeNormalWithCgal,
  toApproximateMatrix,
} from '@jsxcad/algorithm-cgal';

import { Group } from './Group.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { transformCoordinate } from './transform.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const computeNormal = (geometry) =>
  Group(computeNormalWithCgal(linearize(geometry, filter)));

// TODO: Make this more robust.
export const computeNormalCoordinate = (geometry) => {
  const normal = computeNormal(geometry);
  return transformCoordinate([0, 0, 0], toApproximateMatrix(normal.matrix)[1]);
};

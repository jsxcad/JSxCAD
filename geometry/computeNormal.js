import { Group } from './Group.js';
import { computeNormal as computeNormalWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { transformCoordinate } from './transform.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry);

export const computeNormal = (geometry) =>
  Group(computeNormalWithCgal(linearize(geometry, filter)));

// TODO: Make this more robust.
export const computeNormalCoordinates = (geometry) =>
  transformCoordinate([0, 0, 0], computeNormal(geometry).matrix);

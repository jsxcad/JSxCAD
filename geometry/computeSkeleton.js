import { isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { computeSkeleton as computeSkeletonWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

export const ComputeSkeleton = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = computeSkeletonWithCgal(inputs);
  return Group(outputs);
};

export const computeSkeleton = (geometry, geometries) =>
  ComputeSkeleton([geometry, ...geometries]);

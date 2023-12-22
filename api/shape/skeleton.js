import { ComputeSkeleton, computeSkeleton } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Skeleton = Shape.registerMethod3(
  'Skeleton',
  ['geometries'],
  ComputeSkeleton
);

export const skeleton = Shape.registerMethod3(
  'skeleton',
  ['inputGeometry', 'geometries'],
  computeSkeleton
);

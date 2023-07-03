import { ChainConvexHull, chainConvexHull } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const ChainHull = Shape.registerMethod3(
  'ChainHull',
  ['geometries'],
  ChainConvexHull
);

export const chainHull = Shape.registerMethod3(
  'chainHull',
  ['inputGeometry', 'geometries'],
  chainConvexHull
);

export default ChainHull;

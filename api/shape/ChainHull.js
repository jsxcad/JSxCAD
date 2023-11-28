import { ChainConvexHull, chainConvexHull } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const ChainHull = Shape.registerMethod3(
  'ChainHull',
  ['geometries', 'modes:close'],
  ChainConvexHull
);

export const chainHull = Shape.registerMethod3(
  'chainHull',
  ['inputGeometry', 'geometries', 'modes:close'],
  chainConvexHull
);

export default ChainHull;

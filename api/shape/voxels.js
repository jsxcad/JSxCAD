import {
  toVoxelsFromCoordinates,
  toVoxelsFromGeometry,
} from '@jsxcad/geometry';

import { Shape } from './Shape.js';

export const voxels = Shape.registerMethod3(
  'voxels',
  ['inputGeometry', 'number'],
  toVoxelsFromGeometry
);

export const Voxels = Shape.registerMethod3(
  'Voxels',
  ['coordinates'],
  toVoxelsFromCoordinates
);

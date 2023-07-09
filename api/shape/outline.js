import { Shape } from './Shape.js';
import { outline as op } from '@jsxcad/geometry';

export const outline = Shape.registerMethod3(
  'outline',
  ['inputGeometry', 'geometries'],
  op
);

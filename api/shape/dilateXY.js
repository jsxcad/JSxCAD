import Shape from './Shape.js';
import { dilateXY as op } from '@jsxcad/geometry';

export const dilateXY = Shape.registerMethod3(
  'dilateXY',
  ['inputGeometry', 'number'],
  op
);

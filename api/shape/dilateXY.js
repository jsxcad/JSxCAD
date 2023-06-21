import Shape from './Shape.js';
import { dilateXY as dilateXYGeometry } from '@jsxcad/geometry';

export const dilateXY = Shape.registerMethod2(
  'dilateXY',
  ['inputGeometry', 'number'],
  (geometry, amount = 1) =>
    Shape.fromGeometry(dilateXYGeometry(geometry, amount))
);

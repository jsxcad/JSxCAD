import Shape from './Shape.js';
import { bend as bendGeometry } from '@jsxcad/geometry';

export const bend = Shape.registerMethod2(
  'bend',
  ['inputGeometry', 'number'],
  (geometry, radius = 100) => Shape.fromGeometry(bendGeometry(geometry, radius))
);

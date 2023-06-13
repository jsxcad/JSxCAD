import Shape from './Shape.js';
import { hasShowOverlay } from '@jsxcad/geometry';

export const overlay = Shape.registerMethod2(
  'overlay',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasShowOverlay(geometry))
);

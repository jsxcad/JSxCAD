import Shape from './Shape.js';
import { noGhost } from '@jsxcad/geometry';

export const clean = Shape.registerMethod2(
  'clean',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(noGhost(geometry))
);

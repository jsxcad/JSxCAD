import Shape from './Shape.js';
import { unfold as unfoldGeometry } from '@jsxcad/geometry';

export const unfold = Shape.registerMethod2(
  'unfold',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(unfoldGeometry(geometry))
);

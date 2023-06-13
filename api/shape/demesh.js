import Shape from './Shape.js';
import { demesh as demeshGeometry } from '@jsxcad/geometry';

export const demesh = Shape.registerMethod2(
  'demesh',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(demeshGeometry(geometry))
);

import Shape from './Shape.js';
import { hasTypeGhost } from '@jsxcad/geometry';

export const ghost = Shape.registerMethod2(
  'ghost',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasTypeGhost(geometry))
);

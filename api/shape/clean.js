import Shape from './Shape.js';
import { noGhost } from '@jsxcad/geometry';

export const clean = Shape.registerMethod3(
  'clean',
  ['inputGeometry'],
  noGhost
);

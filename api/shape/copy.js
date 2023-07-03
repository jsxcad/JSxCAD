import Shape from './Shape.js';
import { copy as op } from '@jsxcad/geometry';

export const copy = Shape.registerMethod3(
  'copy',
  ['inputGeometry', 'number'],
  op
);

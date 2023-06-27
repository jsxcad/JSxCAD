import Shape from './Shape.js';
import { disjoint as op } from '@jsxcad/geometry';

export const disjoint = Shape.registerMethod3(
  'disjoint',
  ['inputGeometry', 'modes:backward,exact'],
  op
);

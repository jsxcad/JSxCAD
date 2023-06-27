import Shape from './Shape.js';
import { Disjoint as op } from '@jsxcad/geometry';

export const Assembly = Shape.registerMethod3(
  'Assembly',
  ['geometries', 'modes:backward,exact'],
  op
);

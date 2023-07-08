import Shape from './Shape.js';
import { nth as op } from '@jsxcad/geometry';

export const nth = Shape.registerMethod3(
  ['nth', 'n'],
  ['inputGeometry', 'numbers'],
  op
);

export const n = nth;

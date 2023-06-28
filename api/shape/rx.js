import Shape from './Shape.js';
import { rotateXs as op } from '@jsxcad/geometry';

export const rx = Shape.registerMethod3(
  ['rotateX', 'rx'],
  ['inputGeometry', 'numbers'],
  op
);

export const rotateX = rx;

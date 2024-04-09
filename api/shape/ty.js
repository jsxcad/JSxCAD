import Shape from './Shape.js';
import { turnYs as op } from '@jsxcad/geometry';

export const ty = Shape.registerMethod3(
  ['turnY', 'ty'],
  ['inputGeometry', 'numbers'],
  op
);

export const turnY = ty;

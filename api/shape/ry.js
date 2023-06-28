import Shape from './Shape.js';
import { rotateYs as op } from '@jsxcad/geometry';

export const ry = Shape.registerMethod3(
  ['rotateY', 'ry'],
  ['inputGeometry', 'numbers'],
  op
);

export const rotateY = ry;

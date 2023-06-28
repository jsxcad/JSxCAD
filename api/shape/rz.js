import Shape from './Shape.js';
import { rotateZs as op } from '@jsxcad/geometry';

export const rz = Shape.registerMethod3(
  ['rotateZ', 'rz'],
  ['inputGeometry', 'numbers'],
  op
);

export const rotateZ = rz;

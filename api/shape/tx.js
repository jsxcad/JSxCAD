import Shape from './Shape.js';
import { turnXs as op } from '@jsxcad/geometry';

export const tx = Shape.registerMethod3(
  ['turnX', 'tx'],
  ['inputGeometry', 'numbers'],
  op
);

export const turnX = tx;

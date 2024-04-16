import Shape from './Shape.js';
import { turnZs as op } from '@jsxcad/geometry';

export const tz = Shape.registerMethod3(
  ['turnZ', 'tz'],
  ['inputGeometry', 'numbers'],
  op
);

export const turnZ = tz;

import Shape from './Shape.js';
import { gap as op } from '@jsxcad/geometry';

export const gap = Shape.registerMethod3(
  ['gap', 'void'],
  ['inputGeometry'],
  op
);

export const voidFn = gap;

import Shape from './Shape.js';
import { getNot as op } from '@jsxcad/geometry';

export const getNot = Shape.registerMethod3(
  ['getNot', 'gn'],
  ['inputGeometry', 'strings'],
  op
);

export const gn = getNot;

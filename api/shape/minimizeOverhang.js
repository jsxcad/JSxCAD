import Shape from './Shape.js';
import { minimizeOverhang as op } from '@jsxcad/geometry';

export const minimizeOverhang = Shape.registerMethod3(
  'minimizeOverhang',
  ['inputGeometry', 'number'],
  op
);

import Shape from './Shape.js';
import { tag as tagOp } from '@jsxcad/geometry';

export const tag = Shape.registerMethod3(
  'tag',
  ['inputGeometry', 'strings'],
  tagOp
);

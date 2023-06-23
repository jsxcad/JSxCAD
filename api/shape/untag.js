import Shape from './Shape.js';
import { untag as untagOp } from '@jsxcad/geometry';

export const untag = Shape.registerMethod3(
  'untag',
  ['inputGeometry', 'strings'],
  untagOp
);

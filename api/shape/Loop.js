import Shape from './Shape.js';
import { Loop as LoopOp, loop as loopOp } from '@jsxcad/geometry';

export const Loop = Shape.registerMethod3(
  'Loop',
  ['geometries', 'modes:close'],
  LoopOp
);

export const loop = Shape.registerMethod3(
  'loop',
  ['inputGeometry', 'geometries', 'modes:close'],
  loopOp
);

export default Loop;

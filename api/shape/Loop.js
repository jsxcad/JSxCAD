import Shape from './Shape.js';
import { loop as loopOp } from '@jsxcad/geometry';

export const Loop = Shape.registerMethod3(
  'Loop',
  ['geometry', 'geometries', 'modes:close'],
  loopOp
);

export const loop = Shape.registerMethod3(
  'loop',
  ['inputGeometry', 'geometries', 'modes:close'],
  loopOp
);

export default Loop;

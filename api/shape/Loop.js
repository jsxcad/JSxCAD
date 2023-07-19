import { Loop as LoopOp, Points, loop as loopOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Loop = Shape.registerMethod3(
  'Loop',
  ['geometries', 'coordinates', 'modes:close'],
  (geometries, coordinates, modes) =>
    LoopOp([...geometries, Points(coordinates)], modes)
);

export const loop = Shape.registerMethod3(
  'loop',
  ['inputGeometry', 'geometries', 'coordinates', 'modes:close'],
  (geometry, geometries, coordinates, modes) =>
    loopOp(geometry, [...geometries, Points(coordinates)], modes)
);

export default Loop;

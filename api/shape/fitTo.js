import Shape from './Shape.js';
import { disjoint } from '@jsxcad/geometry';

export const fitTo = Shape.registerMethod2(
  'fitTo',
  ['inputGeometry', 'geometries', 'modes:exact'],
  (geometry, geometries, modes) =>
    Shape.fromGeometry(
      disjoint([geometry, ...geometries], undefined, modes.includes('exact'))
    )
);

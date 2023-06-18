import Shape from './Shape.js';
import { disjoint } from '@jsxcad/geometry';

export const fit = Shape.registerMethod2(
  'fit',
  ['inputGeometry', 'geometries', 'modes:exact'],
  (geometry, geometries, modes) =>
    Shape.fromGeometry(
      disjoint([...geometries, geometry], undefined, modes.includes('exact'))
    )
);

import Shape from './Shape.js';
import { measureVolume } from '@jsxcad/geometry';

export const volume = Shape.registerMethod3(
  'volume',
  ['inputGeometry', 'function'],
  (geometry, op = (value) => (_shape) => value) =>
    Shape.applyToGeometry(geometry, op, measureVolume(geometry))
);

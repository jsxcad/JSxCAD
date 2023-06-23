import Shape from './Shape.js';
import { fitTo as op } from '@jsxcad/geometry';

export const fitTo = Shape.registerMethod3(
  ['Assembly', 'fitTo'],
  ['inputGeometry', 'geometries', 'modes:exact'],
  op
);

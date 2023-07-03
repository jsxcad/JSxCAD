import Shape from './Shape.js';
import { deform as op } from '@jsxcad/geometry';

export const deform = Shape.registerMethod3(
  'deform',
  ['inputGeometry', 'geometries', 'options'],
  op
);

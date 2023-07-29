import Shape from './Shape.js';
import { remesh as op } from '@jsxcad/geometry';

export const remesh = Shape.registerMethod3(
  'remesh',
  ['inputGeometry', 'number', 'geometries', 'options'],
  op
);

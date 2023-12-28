import Shape from './Shape.js';
import { approximate as op } from '@jsxcad/geometry';

export const approximate = Shape.registerMethod3(
  'approximate',
  ['inputGeometry', 'number', 'number'],
  op
);

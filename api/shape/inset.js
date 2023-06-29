import Shape from './Shape.js';
import { inset as op } from '@jsxcad/geometry';

export const inset = Shape.registerMethod3(
  'inset',
  ['inputGeometry', 'number', 'options'],
  op
);

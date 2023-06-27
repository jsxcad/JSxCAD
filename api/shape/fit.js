import Shape from './Shape.js';
import { fit as op } from '@jsxcad/geometry';

export const fit = Shape.registerMethod3(
  'fit',
  ['inputGeometry', 'geometries', 'modes:exact'],
  op
);

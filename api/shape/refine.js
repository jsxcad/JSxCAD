import Shape from './Shape.js';
import { refine as op } from '@jsxcad/geometry';

export const refine = Shape.registerMethod3(
  'refine',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (geometry, selections, implicitDensity, { density = implicitDensity } = {}) =>
    op(geometry, selections, { density })
);

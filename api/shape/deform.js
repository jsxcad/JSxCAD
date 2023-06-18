import Shape from './Shape.js';
import { deform as deformGeometry } from '@jsxcad/geometry';

export const deform = Shape.registerMethod2(
  'deform',
  ['inputGeometry', 'geometries', 'options'],
  (geometry, selections, { iterations, tolerance, alpha } = {}) =>
    Shape.fromGeometry(
      deformGeometry(geometry, selections, iterations, tolerance, alpha)
    )
);

import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.registerMethod2(
  'simplify',
  ['inputGeometry', 'number', 'number', 'options'],
  (geometry, cornerThreshold = 20 / 360, eps, { ratio = 1.0 } = {}) =>
    Shape.fromGeometry(simplifyGeometry(geometry, cornerThreshold, eps))
);

import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.registerMethod2(
  'simplify',
  ['inputGeometry', 'number', 'options'],
  (geometry, eps, { ratio = 1.0 } = {}) =>
    Shape.fromGeometry(simplifyGeometry(geometry, ratio, eps))
);

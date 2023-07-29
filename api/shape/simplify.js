import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify = Shape.registerMethod3(
  'simplify',
  ['inputGeometry', 'number', 'number', 'options'],
  (geometry, cornerThreshold = 20 / 360, eps) =>
    simplifyGeometry(geometry, cornerThreshold, eps)
);

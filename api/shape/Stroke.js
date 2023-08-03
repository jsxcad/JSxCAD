import { Shape } from './Shape.js';
import { Stroke as op } from '@jsxcad/geometry';

export const Stroke = Shape.registerMethod3(
  'Stroke',
  ['geometries', 'number', 'options'],
  (geometries, implicitWidth = 1, { width = implicitWidth } = {}) =>
    op(geometries, width)
);

export const stroke = Shape.registerMethod3(
  'stroke',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (geometry, geometries, implicitWidth = 1, { width = implicitWidth } = {}) =>
    op([geometry, ...geometries], width)
);

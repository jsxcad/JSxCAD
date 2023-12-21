import { Stroke as Op } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

export const Stroke = Shape.registerMethod3(
  'Stroke',
  ['geometries', 'number', 'options'],
  (geometries, implicitWidth = 1, { width = implicitWidth } = {}) =>
    Op(geometries, width)
);

export const stroke = Shape.registerMethod3(
  'stroke',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (geometry, geometries, implicitWidth = 1, { width = implicitWidth } = {}) =>
    Op([geometry, ...geometries], width)
);

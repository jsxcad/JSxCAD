import Shape from './Shape.js';
import { inset as insetGeometry } from '@jsxcad/geometry';

export const inset = Shape.registerMethod2(
  'inset',
  ['inputGeometry', 'number', 'options'],
  (geometry, initial = 1, { segments = 16, step, limit } = {}) =>
    Shape.fromGeometry(insetGeometry(geometry, initial, step, limit, segments))
);

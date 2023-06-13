import Shape from './Shape.js';
import { offset as offsetGeometry } from '@jsxcad/geometry';

export const offset = Shape.registerMethod2(
  'offset',
  ['inputGeometry', 'number', 'options'],
  (geometry, initial = 1, { segments = 16, step, limit } = {}) =>
    Shape.fromGeometry(offsetGeometry(geometry, initial, step, limit, segments))
);

export default offset;

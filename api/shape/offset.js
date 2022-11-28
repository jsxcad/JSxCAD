import Shape from './Shape.js';
import { offset as offsetGeometry } from '@jsxcad/geometry';

export const offset = Shape.registerMethod(
  'offset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        offsetGeometry(shape.toGeometry(), initial, step, limit, segments)
      )
);

export default offset;

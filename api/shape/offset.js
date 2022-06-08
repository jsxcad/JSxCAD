import Shape from './Shape.js';
import { offset as offsetGeometry } from '@jsxcad/geometry';

export const offset = Shape.chainable(
  (initial = 1, { segments = 16, step, limit } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        offsetGeometry(shape.toGeometry(), initial, step, limit, segments)
      )
);

Shape.registerMethod('offset', offset);

export default offset;

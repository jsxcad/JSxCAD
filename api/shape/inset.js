import Shape from './Shape.js';
import { inset as insetGeometry } from '@jsxcad/geometry';

export const inset = Shape.registerMethod(
  'inset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        insetGeometry(shape.toGeometry(), initial, step, limit, segments)
      )
);

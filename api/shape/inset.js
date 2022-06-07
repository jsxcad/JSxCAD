import Shape from './Shape.js';
import { inset as insetGeometry } from '@jsxcad/geometry';

export const inset =
  (initial = 1, { segments = 16, step, limit } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      insetGeometry(shape.toGeometry(), initial, step, limit, segments)
    );

Shape.registerMethod('inset', inset);

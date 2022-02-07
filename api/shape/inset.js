import Shape from './Shape.js';
import { inset as insetGeometry } from '@jsxcad/geometry';

export const inset =
  (initial = 1, { segments = 16, step, limit } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      insetGeometry(shape.toGeometry(), initial, { segments, step, limit })
    );

// CHECK: Using 'with' for may be confusing, but andInset looks odd.
export const withInset = (initial, step, limit) => (shape) =>
  shape.and(shape.inset(initial, step, limit));

Shape.registerMethod('inset', inset);
Shape.registerMethod('withInset', withInset);

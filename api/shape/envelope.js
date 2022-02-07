import Shape from './Shape.js';
import { generatePackingEnvelope } from '@jsxcad/geometry';

export const envelope =
  ({ segments = 8, offset = 0.1, threshold = 30.0 } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      generatePackingEnvelope(
        shape.toGeometry(),
        Shape.toValue(offset, shape),
        Shape.toValue(segments, shape),
        Shape.toValue(threshold, shape)
      )
    );

Shape.registerMethod('envelope', envelope);

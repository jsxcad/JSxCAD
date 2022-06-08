import Shape from './Shape.js';
import { measureArea } from '@jsxcad/geometry';

export const area = Shape.chainable(
  (op = (value) => (shape) => value) =>
    (shape) =>
      op(measureArea(shape.toGeometry()))(shape)
);

Shape.registerMethod('area', area);

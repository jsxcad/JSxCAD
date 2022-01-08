import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (iterations = 1, { method = 'Loop' } = {}) =>
  (shape) =>
    Shape.fromGeometry(smoothGeometry(shape.toGeometry(), { iterations, method }));

Shape.registerMethod('smooth', smooth);

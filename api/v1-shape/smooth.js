import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (options = {}) =>
  (shape) =>
    Shape.fromGeometry(smoothGeometry(shape.toGeometry(), options));

Shape.registerMethod('smooth', smooth);

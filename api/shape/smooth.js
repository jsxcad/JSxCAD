import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (options = { iterations: 1, method: 'Subdivide' }, ...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      smoothGeometry(
        shape.toGeometry(),
        options,
        shape.toShapes(shapes).map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('smooth', smooth);

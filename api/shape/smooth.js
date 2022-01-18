import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (options = {}, ...selections) =>
  (shape) =>
    Shape.fromGeometry(
      smoothGeometry(
        shape.toGeometry(),
        options,
        shape.toShapes(selections).map((selection) => selection.toGeometry())
      )
    );

Shape.registerMethod('smooth', smooth);

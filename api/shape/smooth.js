import Shape from './Shape.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth =
  (options = { iterations: 1, method: 'mesh' }, ...selections) =>
  (shape) =>
    Shape.fromGeometry(
      smoothGeometry(
        shape.toGeometry(),
        options,
        shape.toShapes(selections).map((selection) => selection.toGeometry())
      )
    );

Shape.registerMethod('smooth', smooth);

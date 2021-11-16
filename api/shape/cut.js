import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry';

export const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        ...shape.toShapes(shapes).map((other) => other.toGeometry())
      )
    );

Shape.registerMethod('cut', cut);

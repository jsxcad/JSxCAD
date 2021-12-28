import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';

export const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      cutGeometry(
        shape.toGeometry(),
        shape.toShapes(shapes).map((other) => other.toGeometry())
      )
    );

Shape.registerMethod('cut', cut);

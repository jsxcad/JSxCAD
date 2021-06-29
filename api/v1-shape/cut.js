import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry';

export const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('cut', cut);

import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry';

export const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        ...shapes.map((other) => Shape.toShape(other, shape).toGeometry())
      )
    );

Shape.registerMethod('cut', cut);

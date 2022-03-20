import Shape from './Shape.js';
import { join as joinGeometry } from '@jsxcad/geometry';

export const join =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      joinGeometry(
        shape.toGeometry(),
        shapes.map((other) => Shape.toShape(other, shape).toGeometry())
      )
    );

Shape.registerMethod('join', join);
Shape.registerMethod('add', join);

import Shape from './Shape.js';
import { union } from '@jsxcad/geometry';

export const add =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      union(
        shape.toGeometry(),
        ...shapes.map((other) => Shape.toShape(other, shape).toGeometry())
      )
    );

Shape.registerMethod('add', add);

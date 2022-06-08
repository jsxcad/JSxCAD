import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';

export const clip = Shape.chainable(
  (...shapes) =>
    (shape) =>
      Shape.fromGeometry(
        clipGeometry(
          shape.toGeometry(),
          shapes.map((other) => Shape.toShape(other, shape).toGeometry())
        )
      )
);

Shape.registerMethod('clip', clip);

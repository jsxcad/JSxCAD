import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';

export const clipopen =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      clipGeometry(
        shape.toGeometry(),
        shapes.map((other) => Shape.toShape(other, shape).toGeometry()),
        /* open= */ true
      )
    );

Shape.registerMethod('clipopen', clipopen);

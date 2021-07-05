import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loop =
  (...ops) =>
  (shape) =>
    Shape.fromGeometry(
      loftGeometry(
        /* closed= */ true,
        ...ops.map((op) => op(shape).toGeometry())
      )
    );

Shape.registerMethod('loop', loop);

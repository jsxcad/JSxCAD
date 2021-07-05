import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loft =
  (...ops) =>
  (shape) =>
    Shape.fromGeometry(
      loftGeometry(
        /* closed= */ false,
        ...ops.map((op) => op(shape).toGeometry())
      )
    );

Shape.registerMethod('loft', loft);

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

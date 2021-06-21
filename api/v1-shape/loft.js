import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loft = (shape, ...ops) =>
  Shape.fromGeometry(
    loftGeometry(
      /* closed= */ false,
      shape.toGeometry(),
      ...ops.map((op) => op(shape).toGeometry())
    )
  );

Shape.registerMethod('loft', loft);

export const loop = (shape, ...ops) =>
  Shape.fromGeometry(
    loftGeometry(
      /* closed= */ true,
      shape.toGeometry(),
      ...ops.map((op) => op(shape).toGeometry())
    )
  );

Shape.registerMethod('loop', loop);

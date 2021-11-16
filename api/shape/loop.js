import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loop =
  (...ops) =>
  (shape) => {
    // CHECK: Is two sufficient levels?
    return Shape.fromGeometry(
      loftGeometry(
        /* closed= */ true,
        ...shape.toValues(ops).map((shape) => shape.toGeometry())
      )
    );
  };

Shape.registerMethod('loop', loop);

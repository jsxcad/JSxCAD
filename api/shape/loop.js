import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loop =
  (...shapes) =>
  (shape) => {
    // CHECK: Is two sufficient levels?
    return Shape.fromGeometry(
      loftGeometry([
        shape.toGeometry(),
        ...shape.toShapes(shapes).map((shape) => shape.toGeometry()),
      ])
    );
  };

Shape.registerMethod('loop', loop);

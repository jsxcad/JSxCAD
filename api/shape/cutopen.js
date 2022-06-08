import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';

export const cutopen = Shape.chainable(
  (...shapes) =>
    (shape) =>
      Shape.fromGeometry(
        cutGeometry(
          shape.toGeometry(),
          shape.toShapes(shapes).map((other) => other.toGeometry()),
          /* open= */ true
        )
      )
);

Shape.registerMethod('cutopen', cutopen);

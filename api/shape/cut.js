import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry';

export const cut =
  (...shapes) =>
  (shape) => {
    let options;
    if (shapes.length >= 1 && shapes[0].constructor === Object) {
      const { mode, check } = shapes.shift();
      options = { mode, check };
    }
    return Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        options,
        ...shape.toShapes(shapes).map((other) => other.toGeometry())
      )
    );
  };

Shape.registerMethod('cut', cut);

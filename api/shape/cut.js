import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const cut = Shape.chainable((...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    cutGeometry(
      shape.toGeometry(),
      shape.toShapes(shapes).map((other) => other.toGeometry()),
      modes.includes('open'),
      modes.includes('exact')
    )
  );
});

Shape.registerMethod('cut', cut);

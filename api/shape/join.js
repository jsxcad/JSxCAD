import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { join as joinGeometry } from '@jsxcad/geometry';

export const join = Shape.chainable((...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    joinGeometry(
      shape.toGeometry(),
      shapes.map((other) => Shape.toShape(other, shape).toGeometry()),
      modes.includes('exact'),
      modes.includes('noVoid')
    )
  );
});

Shape.registerMethod('join', join);
Shape.registerMethod('add', join);

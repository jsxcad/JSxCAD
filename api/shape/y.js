import Shape from './Shape.js';
import move from './move.js';

export const y = Shape.chainable(
  (...y) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(y).map((y) => move([0, y, 0])(shape)))
);

Shape.registerMethod('y', y);

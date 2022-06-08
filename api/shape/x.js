import Shape from './Shape.js';
import move from './move.js';

export const x = Shape.chainable(
  (...x) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(x).map((x) => move([x, 0, 0])(shape)))
);

Shape.registerMethod('x', x);

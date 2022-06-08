import Shape from './Shape.js';
import move from './move.js';

export const z = Shape.chainable(
  (...z) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(z).map((z) => move([0, 0, z])(shape)))
);

Shape.registerMethod('z', z);

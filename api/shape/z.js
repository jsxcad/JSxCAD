import Shape from './Shape.js';
import move from './move.js';

export const z = Shape.registerMethod(
  'z',
  (...z) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(z).map((z) => move([0, 0, z])(shape)))
);

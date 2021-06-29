import Shape from './Shape.js';
import move from './move.js';

export const z =
  (...z) =>
  (shape) =>
    Shape.Group(...z.map((z) => move(shape, 0, 0, z)));

Shape.registerMethod('z', z);

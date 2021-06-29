import Shape from './Shape.js';
import move from './move.js';

export const x =
  (...x) =>
  (shape) =>
    Shape.Group(...x.map((x) => move(shape, x)));

Shape.registerMethod('x', x);

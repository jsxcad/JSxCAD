import Shape from './Shape.js';
import move from './move.js';

export const y =
  (...y) =>
  (shape) =>
    Shape.Group(...y.map((y) => move(shape, 0, y)));

Shape.registerMethod('y', y);

import Shape from './Shape.js';
import move from './move.js';

export const x =
  (...x) =>
  (shape) =>
    Shape.Group(...shape.toFlatValues(x).map((x) => move(x)(shape)));

Shape.registerMethod('x', x);

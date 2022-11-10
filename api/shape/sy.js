import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleY = Shape.registerMethod(
  ['scaleY', 'sy'],
  (...y) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(y).map((y) => scale(1, y, 1)(shape)))
);

export const sy = scaleY;

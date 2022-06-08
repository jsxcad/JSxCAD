import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleY = Shape.chainable(
  (...y) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(y).map((y) => scale(1, y, 1)(shape)))
);

export const sy = scaleY;

Shape.registerMethod('scaleY', scaleY);
Shape.registerMethod('sy', sy);

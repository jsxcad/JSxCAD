import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleX =
  (...x) =>
  (shape) =>
    Shape.Group(...shape.toFlatValues(x).map((x) => scale(x, 1, 1)(shape)));

export const sx = scaleX;

Shape.registerMethod('scaleX', scaleX);
Shape.registerMethod('sx', sx);

import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleZ =
  (...z) =>
  (shape) =>
    Shape.Group(...shape.toFlatValues(z).map((z) => scale(1, 1, z)(shape)));

export const sz = scaleZ;

Shape.registerMethod('scaleZ', scaleZ);
Shape.registerMethod('sz', sz);

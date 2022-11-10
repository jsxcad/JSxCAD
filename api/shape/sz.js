import Shape from './Shape.js';
import { scale } from './scale.js';

export const scaleZ = Shape.registerMethod(
  ['scaleZ', 'sz'],
  (...z) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(z).map((z) => scale(1, 1, z)(shape)))
);

export const sz = scaleZ;

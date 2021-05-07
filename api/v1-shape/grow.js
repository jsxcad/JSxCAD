import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry-tagged';

export const grow = (shape, amount) =>
  Shape.fromGeometry(growGeometry(shape.toGeometry(), amount));

const growMethod = function (amount) {
  return grow(this, amount);
};

Shape.registerMethod('grow', growMethod);

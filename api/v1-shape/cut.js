import Shape from './Shape.js';
import { difference } from '@jsxcad/geometry-tagged';

export const cut = (shape, ...shapes) =>
  Shape.fromGeometry(
    difference(shape.toGeometry(), ...shapes.map((shape) => shape.toGeometry()))
  );

const cutMethod = function (...shapes) {
  return cut(this, ...shapes);
};
Shape.prototype.cut = cutMethod;

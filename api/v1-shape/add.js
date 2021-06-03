import Shape from './Shape.js';
import { union } from '@jsxcad/geometry';

export const add = (shape, ...shapes) =>
  Shape.fromGeometry(
    union(shape.toGeometry(), ...shapes.map((shape) => shape.toGeometry()))
  );

const addMethod = function (...shapes) {
  return add(this, ...shapes);
};
Shape.prototype.add = addMethod;

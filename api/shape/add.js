import Shape from './Shape.js';
import { union } from '@jsxcad/geometry';

export const add =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      union(shape.toGeometry(), ...shapes.map((shape) => shape.toGeometry()))
    );

Shape.registerMethod('add', add);

import Shape from './Shape.js';
import { fromScaling } from '@jsxcad/math-mat4';

export const scale =
  (x = 1, y = x, z = y) =>
  (shape) =>
    shape.transform(fromScaling([x, y, z]));

Shape.registerMethod('scale', scale);

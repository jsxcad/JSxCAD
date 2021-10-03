import Shape from './Shape.js';
import { fromScaling } from '@jsxcad/math-mat4';

export const scale =
  (x = 1, y = x, z = y) =>
  (shape) => {
    const negatives = (x < 0) + (y < 0) + (z < 0);
    if (negatives % 2) {
      // Compensate for inversion.
      return shape.transform(fromScaling([x, y, z])).flip();
    } else {
      return shape.transform(fromScaling([x, y, z]));
    }
  };

Shape.registerMethod('scale', scale);

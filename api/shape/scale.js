import Shape from './Shape.js';
import { fromScaleToTransform } from '@jsxcad/algorithm-cgal';

export const scale =
  (x = 1, y = x, z = y) =>
  (shape) => {
    [x = 1, y = x, z] = shape.toCoordinate(x, y, z);
    const negatives = (x < 0) + (y < 0) + (z < 0);
    if (negatives % 2) {
      // Compensate for inversion.
      return shape.transform(fromScaleToTransform(x, y, z)).flip();
    } else {
      return shape.transform(fromScaleToTransform(x, y, z));
    }
  };

Shape.registerMethod('scale', scale);

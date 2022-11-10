import Shape from './Shape.js';
import { fromScaleToTransform } from '@jsxcad/geometry';

export const scale = Shape.registerMethod(
  'scale',
  (x = 1, y = x, z = y) =>
    async (shape) => {
      [x = 1, y = x, z] = await shape.toCoordinate(x, y, z);
      if (x === 0) {
        x = 1;
      }
      if (y === 0) {
        y = 1;
      }
      if (z === 0) {
        z = 1;
      }
      const negatives = (x < 0) + (y < 0) + (z < 0);
      if (negatives % 2) {
        // Compensate for inversion.
        return shape.eagerTransform(fromScaleToTransform(x, y, z)).involute();
      } else {
        return shape.eagerTransform(fromScaleToTransform(x, y, z));
      }
    }
);

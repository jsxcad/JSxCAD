import Shape from './Shape.js';
import { size } from './size.js';

export const scaleToFit = Shape.registerMethod(
  'scaleToFit',
  (x = 1, y = x, z = y) =>
    async (shape) => {
      return size(({ length, width, height }) => (shape) => {
        const xFactor = x / length;
        const yFactor = y / width;
        const zFactor = z / height;
        // Surfaces may get non-finite factors -- use the unit instead.
        const finite = (factor) => (isFinite(factor) ? factor : 1);
        return shape.scale(finite(xFactor), finite(yFactor), finite(zFactor));
      })(shape);
    }
);

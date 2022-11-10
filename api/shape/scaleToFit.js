import Shape from './Shape.js';

export const scaleToFit = Shape.registerMethod(
  'scaleToFit',
  (x = 1, y = x, z = y) =>
    (shape) => {
      const { length, width, height } = shape.size();
      const xFactor = x / length;
      const yFactor = y / width;
      const zFactor = z / height;
      // Surfaces may get non-finite factors -- use the unit instead.
      const finite = (factor) => (isFinite(factor) ? factor : 1);
      return shape.scale(finite(xFactor), finite(yFactor), finite(zFactor));
    }
);

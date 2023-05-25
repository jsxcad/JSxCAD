import Shape from './Shape.js';
import { size } from './size.js';

export const scaleToFit = Shape.registerMethod2(
  'scaleToFit',
  ['input', 'number', 'number', 'number'],
  async (input, x = 1, y = x, z = y) =>
    size(
      'length',
      'width',
      'height',
      (length, width, height) => async (input) => {
        const xFactor = x / length;
        const yFactor = y / width;
        const zFactor = z / height;
        // Surfaces may get non-finite factors -- use the unit instead.
        const finite = (factor) => (isFinite(factor) ? factor : 1);
        return input.scale(finite(xFactor), finite(yFactor), finite(zFactor));
      }
    )(input)
);

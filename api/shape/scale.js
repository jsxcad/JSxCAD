import Shape from './Shape.js';
import { eagerTransform } from './eagerTransform.js';
import { fromScaleToTransform } from '@jsxcad/geometry';

export const scale = Shape.registerMethod2(
  ['scale', 's'],
  ['input', 'coordinate', 'number', 'number', 'number'],
  async (input, coordinate, dX = 1, dY = dX, dZ = dY) => {
    let [x, y, z] = coordinate || [dX, dY, dZ];
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
    if (!isFinite(x)) {
      throw Error(`scale received non-finite x: ${x}`);
    }
    if (!isFinite(y)) {
      throw Error(`scale received non-finite y: ${y}`);
    }
    if (!isFinite(z)) {
      throw Error(`scale received non-finite z: ${z}`);
    }
    if (negatives % 2) {
      // Compensate for inversion.
      return eagerTransform(fromScaleToTransform(x, y, z)).involute()(input);
    } else {
      return eagerTransform(fromScaleToTransform(x, y, z))(input);
    }
  }
);

export const s = scale;

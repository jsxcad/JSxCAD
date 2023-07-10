import { eagerTransform } from './eagerTransform.js';
import { fromScaleToTransform } from '@jsxcad/algorithm-cgal';
import { involute } from './involute.js';

export const scale = (geometry, [x = 1, y = 1, z = 1]) => {
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
  let scaledGeometry = eagerTransform(geometry, fromScaleToTransform(x, y, z));
  if (negatives % 2) {
    // Compensate for inversion.
    return involute(scaledGeometry);
  } else {
    return scaledGeometry;
  }
};

export const scaleUniformly = (geometry, amount) =>
  scale(geometry, [amount, amount, amount]);

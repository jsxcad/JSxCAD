import { eagerTransform } from './eagerTransform.js';
import { fromScaleToTransform } from '@jsxcad/algorithm-cgal';
import { involute } from './involute.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { transform } from './transform.js';

const X = 0;
const Y = 1;
const Z = 2;

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

export const scaleLazy = (geometry, [x = 1, y = 1, z = 1]) => {
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
  let scaledGeometry = transform(geometry, fromScaleToTransform(x, y, z));
  if (negatives % 2) {
    // Compensate for inversion.
    return involute(scaledGeometry);
  } else {
    return scaledGeometry;
  }
};

export const scaleUniformly = (geometry, amount) =>
  scale(geometry, [amount, amount, amount]);

export const scaleToFit = (geometry, [x = 1, y = x, z = y]) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return geometry;
  }
  const [min, max] = bounds;
  const length = max[X] - min[X];
  const width = max[Y] - min[Y];
  const height = max[Z] - min[Z];
  const xFactor = x / length;
  const yFactor = y / width;
  const zFactor = z / height;
  // Surfaces may get non-finite factors -- use the unit instead.
  const finite = (factor) => (isFinite(factor) ? factor : 1);
  return scale(geometry, [finite(xFactor), finite(yFactor), finite(zFactor)]);
};

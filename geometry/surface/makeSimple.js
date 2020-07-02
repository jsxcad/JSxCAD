import { toPlane } from './toPlane.js';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform } from './ops.js';
import { union } from '@jsxcad/geometry-z0surface-boolean';

export const makeSimple = (options = {}, surface) => {
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let simpleSurface = union(
    ...transform(to, surface).map((polygon) => [polygon])
  );
  return transform(from, simpleSurface);
};

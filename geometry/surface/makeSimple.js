import { toPlane, transform } from './ops';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { union } from '@jsxcad/geometry-z0surface';

export const makeSimple = (options = {}, surface) => {
  const [to, from] = toXYPlaneTransforms(toPlane(surface));
  let simpleSurface = union(...transform(to, surface).map(polygon => [polygon]));
  return transform(from, simpleSurface);
};

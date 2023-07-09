import { buildCorners, computeMiddle, computeScale } from './corners.js';

import { ConvexHull } from './convexHull.js';
import { Points } from './Point.js';
import { scale as scaleOp } from './scale.js';
import { translate } from './translate.js';

// Unit icosahedron vertices.
const points = Points([
  [0.850651, 0.0, -0.525731],
  [0.850651, -0.0, 0.525731],
  [-0.850651, -0.0, 0.525731],
  [-0.850651, 0.0, -0.525731],
  [0.0, -0.525731, 0.850651],
  [0.0, 0.525731, 0.850651],
  [0.0, 0.525731, -0.850651],
  [0.0, -0.525731, -0.850651],
  [-0.525731, -0.850651, -0.0],
  [0.525731, -0.850651, -0.0],
  [0.525731, 0.850651, 0.0],
  [-0.525731, 0.850651, 0.0],
]);

export const Icosahedron = ([x = 1, y = x, z = x]) => {
  const [c1, c2] = buildCorners(x, y, z);
  const scale = computeScale(c1, c2);
  const middle = computeMiddle(c1, c2);
  return translate(scaleOp(ConvexHull([points]), scale), middle);
};

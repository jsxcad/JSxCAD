import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getMatrix,
  getTo,
} from './plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry-tagged';

import { negate } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;

registerReifier('Box', ({ tags, plan }) => {
  const corner1 = getCorner1(plan);
  const corner2 = getCorner2(plan);
  const left = corner1[X];
  const right = corner2[X];
  const front = corner1[Y];
  const back = corner2[Y];
  const top = corner2[Z];
  const bottom = corner1[Z];

  return Shape.fromPath([
    [left, back, bottom],
    [right, back, bottom],
    [right, front, bottom],
    [left, front, bottom],
  ])
    .fill()
    .ex(top, bottom)
    .orient({
      center: negate(getAt(plan)),
      from: getFrom(plan),
      at: getTo(plan),
    })
    .transform(getMatrix(plan))
    .setTags(tags)
    .toGeometry();
});

export const Box = (x, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Box' })).diameter(x, y, z);

Shape.prototype.Box = shapeMethod(Box);

export default Box;

import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import {
  getBack,
  getBottom,
  getCenter,
  getFrom,
  getFront,
  getLeft,
  getMatrix,
  getRight,
  getTo,
  getTop,
} from '@jsxcad/geometry-plan';

import { reify, taggedPlan } from '@jsxcad/geometry-tagged';

reify.Box = (plan) => {
  const left = getLeft(plan);
  const right = getRight(plan);
  const front = getFront(plan);
  const back = getBack(plan);
  const top = getTop(plan);
  const bottom = getBottom(plan);
  const [, , Z] = getCenter(plan);
  return Shape.fromPath([
    [left, back, Z],
    [right, back, Z],
    [right, front, Z],
    [left, front, Z],
  ])
    .fill()
    .ex(top, bottom)
    .orient({ center: getCenter(plan), from: getFrom(plan), at: getTo(plan) })
    .transform(getMatrix(plan))
    .toGeometry();
};

export const Box = (x, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { diameter: [x, y, z], type: 'Box' }));

Shape.prototype.Box = shapeMethod(Box);

export default Box;

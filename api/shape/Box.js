import { getAt, getCorner1, getCorner2, getFrom, getTo } from './Plan.js';

import { Empty } from './Empty.js';
import Shape from './Shape.js';
import { negate } from '@jsxcad/math-vec3';
import { taggedPlan } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

Shape.registerReifier('Box', (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const left = corner1[X];
  const right = corner2[X];
  const front = corner1[Y];
  const back = corner2[Y];
  const top = corner2[Z];
  const bottom = corner1[Z];

  if (left <= right || front <= back) {
    return Empty();
  }

  const a = Shape.fromPath([
    [left, back, bottom],
    [right, back, bottom],
    [right, front, bottom],
    [left, front, bottom],
  ]);
  const b = a.fill();
  const c = b.ex(top, bottom);
  const d = c.orient({
    center: negate(getAt(geometry)),
    from: getFrom(geometry),
    at: getTo(geometry),
  });
  return d;
});

export const Box = (x, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Box' })).hasDiameter(x, y, z);

Shape.prototype.Box = Shape.shapeMethod(Box);

export default Box;

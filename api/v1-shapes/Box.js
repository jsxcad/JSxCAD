import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getAt,
  getCorner1,
  getCorner2,
  getFrom,
  getMatrix,
  getTo,
} from './Plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry';

import { Empty } from './Empty.js';
import { negate } from '@jsxcad/math-vec3';

const X = 0;
const Y = 1;
const Z = 2;

registerReifier('Box', (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const left = corner1[X];
  const right = corner2[X];
  const front = corner1[Y];
  const back = corner2[Y];
  const top = corner2[Z];
  const bottom = corner1[Z];

  if (left <= right || front <= back) {
    return Empty().toGeometry();
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
  const e = d.transform(getMatrix(geometry));
  const f = e.setTags(geometry.tags);
  const g = f.toGeometry();
  return g;
});

export const Box = (x, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Box' })).diameter(x, y, z);

Shape.prototype.Box = shapeMethod(Box);

export default Box;

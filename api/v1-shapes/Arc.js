import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import {
  getBottom,
  getCenter,
  getFrom,
  getMatrix,
  getRadius,
  getSides,
  getTo,
  getTop,
} from '@jsxcad/geometry-plan';
import { reify, taggedPlan } from '@jsxcad/geometry-tagged';

import Spiral from './Spiral.js';

reify.Arc = (plan) => {
  const { start = 0, end = 360 } = plan.angle || {};
  const spiral = Spiral((a) => [[1]], {
    from: start - 90,
    upto: end - 90,
    by: 360 / getSides(plan),
  }).scale(...getRadius(plan));
  if (end - start === 360) {
    // return spiral.close().fill().ex(getTop(plan), getBottom(plan)).move(...getCenter(plan)).transform(getMatrix(plan)).toGeometry();
    return spiral
      .close()
      .fill()
      .ex(getTop(plan), getBottom(plan))
      .orient({ center: getCenter(plan), from: getFrom(plan), at: getTo(plan) })
      .transform(getMatrix(plan))
      .toGeometry();
  } else {
    return spiral
      .move(...getCenter(plan))
      .transform(getMatrix(plan))
      .toGeometry();
  }
};

export const Arc = (x = 1, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { diameter: [x, y, z], type: 'Arc' }));

Shape.prototype.Arc = shapeMethod(Arc);

export default Arc;
